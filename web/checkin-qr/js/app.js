window.MINERVA = window.MINERVA || {};

MINERVA.dropdown = (() => {
	let place_data;
	let isScClub = false;

	function loadData() {
		$.ajax({
			type: "GET",
			url: "./getPlaceData.php",
			async: false,
			success: function (data) {
				place_data = data;
			},
		});
	}

	function makeDropdown() {
		$(document).ready(function ($) {
			loadData();
			place_data.forEach((group) => {
				$("#drop-group").append(
					`<option value=${group.group_id}>${group.group_name}</option>`
				);
			});
		});
	}
	function changeDropdown() {
		$('select[name="place-id"] option').remove(); // これまでのを削除
		let group_id = $("#drop-group").val();
		let place_data_extract = place_data.find((val) => {
			return val.group_id == group_id;
		});
		$("#drop-place").append(
			`<option disabled selected value>選択してください</option>`
		);
		place_data_extract.place.forEach((place) => {
			$("#drop-place").append(
				`<option value=${place.place_id}>${place.place_name}</option>`
			);
		});
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

	function getCamera(device_id = null) {
		let devices_list = [];
		var video_setting;
		const w = 1280;
		const h = 720;
		if (device_id) {
			video_setting = {
				deviceId: device_id,
				width: w,
				height: h,
				aspectRatio: { exact: w / h },
			};
		} else {
			video_setting = {
				facingMode: {
					exact: "environment",
				},
				width: w,
				height: h,
				aspectRatio: { exact: w / h },
			};
		}
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: video_setting,
			})
			.then((stream) => {
				video.srcObject = stream;
				video.onloadedmetadata = () => {
					video.play();
					findQR();
				};
				console.log($("select#camera-souce").children().length);
				//許可を得た後にドロップダウンを作成
				if ($("select#camera-souce").children().length == 1) {
					navigator.mediaDevices.enumerateDevices().then((devices) => {
						devices.forEach((val) => {
							if (val.kind == "videoinput") {
								devices_list.push(val);
							}
						});
						//devices_list = devices;
						console.log(devices_list);
						devices_list.forEach((device) => {
							$("#camera-souce").append(
								`<option value=${device.deviceId}>${device.label}</option>`
							);
						});
					});
				}
			})
			.catch(() => {
				document.querySelector("#js-unsupported").classList.add("is-show");
			});
	}

	function initCamera() {
		getCamera();
	}

	function changeCameraSouce() {
		let stream = video.srcObject;
		let tracks = stream.getTracks();

		tracks.forEach(function (track) {
			track.stop();
		});

		video.srcObject = null;
		console.log($("select#camera-souce").val());
		getCamera($("select#camera-souce").val());
	}

	return {
		initCamera,
		findQR,
		changeCameraSouce,
	};
})();

MINERVA.modal = (() => {
	const result = document.querySelector("#js-result");
	const modal = document.querySelector("#js-modal");
	const modalClose = document.querySelector("#js-modal-close");
	const entryBtn = document.querySelector("#js-entry");
	const title = document.querySelector("#js-title");


	function open(qrData) {
		const data_parsed = qrData.match(/number=(\d{6})/);
		if (data_parsed) {
			title.innerHTML = "登録しますか？";
			result.innerHTML = data_parsed[1];
			modal.classList.add("success");
			modal.classList.add("is-show");
		} else {
			title.innerHTML = "失敗";
			result.innerHTML = "登録番号がフォーマットと一致しません。";
			modal.classList.add("fail");
			modal.classList.add("is-show");
		}
	}

	function close() {
		modal.classList.remove("is-show");
		MINERVA.reader.findQR();
	}

	function entryData() {
		if(title.innerHTML != "失敗"){
			MINERVA.sendData.send(result.innerHTML);
		}
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

	function send(visitorId) {
		if (!/^\d{6}$/.test(visitorId)) {
			showAlert(-1);
		} else if (!$("#drop-group").val() || !$("#drop-place").val()) {
			showAlert(-2);
		} else {
			$.ajax({
				url: "./entryQr.php",
				type: "POST",
				data: {
					visitor_id: visitorId,
					group_id: $("#drop-group").val(),
					place_id: $("#drop-place").val(),
				},
			})
				.done((data) => {
					console.log(data);
					if (data == "success") {
						showAlert(1);
					} else if (data == "no data") {
						showAlert(-4);
					} else {
						showAlert(-3);
						console.log(data);
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
			case -4:
				result.innerHTML = "登録されていない番号です";
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
$('select[name="camera-souce-id"]').change(function () {
	MINERVA.reader.changeCameraSouce();
});
