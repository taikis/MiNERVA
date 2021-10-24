window.MINERVA = window.MINERVA || {};

MINERVA.dropdown = (() => {
	let place_data;
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
	const form_input = document.getElementById('number');
	const form = document.getElementById('checkin-form');
	function push_submit(){
		MINERVA.modal.open(form_input.value);
		form.reset();
	}
	return {
		push_submit,
	};
})();

MINERVA.modal = (() => {
	const result = document.querySelector("#js-result");
	const modal = document.querySelector("#js-modal");
	const modalClose = document.querySelector("#js-modal-close");
	const entryBtn = document.querySelector("#js-entry");
	const title = document.querySelector("#js-title");


	function open(qrData) {
		const data_parsed = qrData.match(/^(\d{6})$/);
		if (data_parsed) {
			title.innerHTML = "登録しますか？";
			result.innerHTML = data_parsed[1];
			modal.classList.remove("fail");
			modal.classList.add("success");
			modal.classList.add("is-show");
		} else {
			title.innerHTML = "失敗";
			result.innerHTML = "登録番号がフォーマットと一致しません。";
			modal.classList.remove("success");
			modal.classList.add("fail");
			modal.classList.add("is-show");
		}
	}

	function close() {
		modal.classList.remove("is-show");
	}

	function entryData() {
		if(title.innerHTML != "失敗"){
			MINERVA.sendData.send(result.innerHTML);
		}
		modal.classList.remove("is-show");
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
			modal.classList.remove("fail");
			modal.classList.add("success");
		} else {
			title.innerHTML = "送信失敗";
			modal.classList.remove("success");
			modal.classList.add("fail");
		}
		switch (parameter) {
			case 1:
				result.innerHTML = "続けて入力できます";
				break;
			case -1:
				result.innerHTML = "登録番号がフォーマットと一致しません。";
				break;
			case -2:
				result.innerHTML = "団体名と場所を指定してください";
				break;
			case -3:
				result.innerHTML = "サーバーエラー<br>時間をおいてください";
				break;
			case -4:
				result.innerHTML = "登録されていない番号です<br>来場者の方にQRコードを読み取っていただき、<br>登録を促してください。";;
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
$('select[name="group-id"]').change(function () {
	MINERVA.dropdown.changeDropdown();
});
function send_data(){
	MINERVA.reader.push_submit();
}