window.MINERVA = window.MINERVA || {};

MINERVA.dropdown = (() => {
	let generalData;
	let specialData;
	let generalLen;
	let specialLen;
	let isScClub = false;

	function loadData() {
		$.ajax({
			type: "GET",
			url: "./js/data_general.json",
			async: false,
			success: function (data) {
				generalData = data;
				generalLen = data.length;
			},
		});
		$.ajax({
			type: "GET",
			url: "./js/data_special.json",
			async: false,
			success: function (data) {
				specialData = data;
				specialLen = data.length;
			},
		});
	}

	function makeDropdown() {
		$(document).ready(function ($) {
			loadData();
			$.getJSON("./js/data_club.json", (data) => {
				const dataLen = data.length;
				for (var i = 0; i < dataLen; i++) {
					$("#drop-group").append(
						`<option value=${data[i].id}>${data[i].name}</option>`
					);
				}
			});
			for (var i in generalData) {
				$("#drop-place").append(
					`<option value=${generalData[i].id}>${generalData[i].name}</option>`
				);
			}
		});
	}
	function changeDropdown() {
		console.log(specialData);

		if ($("#drop-group").val() == "001" && isScClub == false) {
			isScClub = true;
			for (var i = generalLen; i < specialLen; ++i) {
				$("#drop-place").append(
					`<option value=${specialData[i].id}>${specialData[i].name}</option>`
				);
			}
		}
		if ($("#drop-group").val() != "001" && isScClub == true) {
			isScClub = false;
			$('select[name="place-id"] option').remove();
			$("#drop-place").append(
				`<option disabled selected value>選択してください</option>`
			);
			for (var i in generalData) {
				$("#drop-place").append(
					`<option value=${generalData[i].id}>${generalData[i].name}</option>`
				);
			}
		}
	}

	return {
		makeDropdown,
		changeDropdown,
	};
})();

MINERVA.reader = (() => {
	if (!navigator.mediaDevices) {
		$("#js-unsupported").addClass("is-show");
		return;
	}

	const video = document.querySelector("#js-video");

	function findQR() {
		const canvas = document.querySelector("#js-canvas");
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const code = jsQR(imageData.data, canvas.width, canvas.height);

		if (code) {
			MINERVA.modal.open(code.data);
		} else {
			setTimeout(findQR, 500);
		}
	}

	function initCamera() {
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: {
					facingMode: {
						exact: "environment",
					},
				},
			})
			.then((stream) => {
				video.srcObject = stream;
				video.onloadedmetadata = () => {
					video.play();
					findQR();
				};
			})
			.catch(() => {
				document.querySelector("#js-unsupported").classList.add("is-show");
			});
	}

	return {
		initCamera,
		findQR,
	};
})();

MINERVA.modal = (() => {
	const result = document.querySelector("#js-result");
	const modal = document.querySelector("#js-modal");
	const modalClose = document.querySelector("#js-modal-close");
	const entryBtn = document.querySelector("#js-entry");

	function open(qrData) {
		result.innerHTML = qrData;
		modal.classList.add("is-show");
	}

	function close() {
		modal.classList.remove("is-show");
		MINERVA.reader.findQR();
	}

	function entryData() {
		MINERVA.sendData.send(result.innerHTML);
		modal.classList.remove("is-show");
		MINERVA.reader.findQR();
	}

	modalClose.addEventListener("click", () => close());

	entryBtn.addEventListener("click", entryData);

	return {
		open,
	};
})();

MINERVA.sendData = (() => {
	const result = document.querySelector("#js-alert-result");
	const title = document.querySelector("#js-alert-title");
	const modal = document.querySelector("#js-alert");
	const modalClose = document.querySelector("#js-alert-close");

	function send(fresherId) {
		if (!/^[0-9]{6}/.test(fresherId)) {
			showAlert(-1);
		} else if (!$("#drop-group").val() || !$("#drop-place").val()) {
			showAlert(-2);
		} else {
			$.ajax({
				url: "./entryQr.php",
				type: "POST",
				data: {
					fresher_id: fresherId,
					group_id: $("#drop-group").val(),
					place_id: $("#drop-place").val(),
				},
			})
				.done((data) => {
					if ((data.text = "success")) {
						showAlert(1);
					} else {
						showAlert(-3);
						console.log(data.text);
					}
				})
				.fail(() => {
					showAlert(-3);
				});
		}
	}
	/**
	 * アラートを表示
	 *
	 * @param {number} parameter 1:成功, -1:登録番号不一致, -2:指定なし, -3:サーバーエラー
	 */
	function showAlert(parameter) {
		if (0 < parameter) {
			title.innerHTML = "送信成功";
			modal.classList.add("success");
		} else {
			title.innerHTML = "送信失敗";
			modal.classList.add("fail");
		}
		switch (parameter) {
			case 1:
				result.innerHTML = "続けてスキャンできます";
				break;
			case -1:
				result.innerHTML = "登録番号がフォーマットと一致しません。";
				break;
			case -2:
				result.innerHTML = "団体名と場所を指定してください";
				break;
			case -3:
				result.innerHTML = "サーバーエラー\n時間をおいてください";
				break;
		}
		modal.classList.add("is-show");
	}

	function close() {
		modal.classList.remove("is-show");
		modal.classList.remove("success");
		modal.classList.remove("fail");
	}

	modalClose.addEventListener("click", () => close());

	return {
		send,
	};
})();

MINERVA.dropdown.makeDropdown();
if (MINERVA.reader) MINERVA.reader.initCamera();
$('select[name="group-id"]').change(function () {
	MINERVA.dropdown.changeDropdown();
});
