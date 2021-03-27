window.MINERVA = window.MINERVA || {};

MINERVA.dropdown = (() => {
	groupOp = [
		{
			name: "あぐり",
			id: 101,
		},
		{
			name: "計算技術研究会",
			id: 102,
		},
		{
			name: "航空工学研究会HoPE",
			id: 103,
		},
		{
			name: "電気研究会",
			id: 104,
		},
		{
			name: "空手道部",
			id: 105,
		},
		{
			name: "自動車研究会",
			id: 106,
		},
		{
			name: "Libertyer",
			id: 107,
		},
		{
			name: "法政大学放送研究会MediaWave",
			id: 108,
		},
		{
			name: "法政大学工学部マンドリンクラブ",
			id: 109,
		},
		{
			name: "小金井groovy",
			id: 110,
		},
		{
			name: "ロック研究会",
			id: 111,
		},
		{
			name: "ウエスタンプレイボーイズ",
			id: 112,
		},
		{
			name: "社交舞踏研究会",
			id: 113,
		},
		{
			name: "将棋部",
			id: 114,
		},
		{
			name: "漫画研究会",
			id: 115,
		},
		{
			name: "小金井鉄道研究会",
			id: 116,
		},
		{
			name: "写真技術研究会",
			id: 117,
		},
		{
			name: "ESS",
			id: 118,
		},
		{
			name: "ポケモンだいすきクラブ",
			id: 119,
		},
		{
			name: "バレーボール部",
			id: 120,
		},
		{
			name: "少林寺拳法部",
			id: 121,
		},
		{
			name: "スキー部",
			id: 122,
		},
		{
			name: "バスケットボール部",
			id: 123,
		},
		{
			name: "ワンダーフォーゲル部",
			id: 124,
		},
		{
			name: "陸上競技部",
			id: 125,
		},
		{
			name: "水泳部",
			id: 126,
		},
		{
			name: "ラグビー部",
			id: 127,
		},
		{
			name: "卓球部",
			id: 128,
		},
		{
			name: "合気道部",
			id: 129,
		},
		{
			name: "サッカー部",
			id: 130,
		},
		{
			name: "機械研究会",
			id: 131,
		},
		{
			name: "柔道部",
			id: 132,
		},
		{
			name: "アルティメット部",
			id: 133,
		},
		{
			name: "ソフトテニス部",
			id: 134,
		},
		{
			name: "応援団",
			id: 135,
		},
		{
			name: "体育会航空部",
			id: 136,
		},
		{
			name: "オープンキャンパススタッフ",
			id: 137,
		},
		{
			name: "法政大学交響楽団",
			id: 138,
		},
		{
			name: "法政大学エレクトーンサークルCOSMOS",
			id: 139,
		},
		{
			name: "k-boys",
			id: 140,
		},
		{
			name: "TCG同好会",
			id: 141,
		},
	];
	placeOp = [
		{
			name: "中庭ブース",
			id: "01",
		},
		{
			name: "部室",
			id: "02",
		},
		{
			name: "展示物",
			id: "03",
		},
	];
	const makeDropdown = () => {
		jQuery(document).ready(function ($) {
			for (var i in groupOp) {
				$("#drop-group").append(
					"<option value=" + groupOp[i].id + ">" + groupOp[i].name + "</option>"
				);
			}
			for (var i in placeOp) {
				$("#drop-place").append(
					"<option value=" + placeOp[i].id + ">" + placeOp[i].name + "</option>"
				);
			}
		});
	};

	return {
		makeDropdown,
	};
})();

MINERVA.reader = (() => {
	if (!navigator.mediaDevices) {
		document.querySelector("#js-unsupported").classList.add("is-show");
		return;
	}

	const video = document.querySelector("#js-video");

	/**
	 * videoの出力をCanvasに描画して画像化 jsQRを使用してQR解析
	 */

	const findQR = () => {
		const canvas = document.querySelector("#js-canvas");
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const code = jsQR(imageData.data, canvas.width, canvas.height);

		if (code) {
			MINERVA.modal.open(code.data);
		} else {
			setTimeout(findQR, 200);
		}
	};
	/**
	 * デバイスのカメラを起動
	 */
	const initCamera = () => {
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
	};

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

	/**
	 * 取得した文字列を入れ込んでモーダルを開く
	 */
	const open = (qrData) => {
		result.value = qrData;
		modal.classList.add("is-show");
	};

	/**
	 * モーダルを閉じてQR読み込みを再開
	 */
	const close = () => {
		modal.classList.remove("is-show");
		MINERVA.reader.findQR();
	};

	const entryData = () => {
		MINERVA.sendData.send(result.value);
		modal.classList.remove("is-show");
		MINERVA.reader.findQR();
	};

	modalClose.addEventListener("click", () => close());

	entryBtn.addEventListener("click", entryData);

	return {
		open,
	};
})();

MINERVA.sendData = (() => {
	const result = document.querySelector("#js-send-result");
	const modal = document.querySelector("#js-send");
	const modalClose = document.querySelector("#js-send-close");

	const send = (fresherId) => {
		if (/^[0-9]{6}/.test(fresherId)) {

			$.ajax({
				url: "./entryQr.php",
				type: "POST",
				data: {
					fresher_id: fresherId,
					group_id: $("#drop-group").val(),
					place_id: $("#drop-place").val()
				},
			})
				.done((data) => {
					if ((data.text = "success")) {
						result.value = "送信成功";
					} else {
						result.value = "登録失敗";
						console.log(data.text);
					}
					modal.classList.add("is-show");
				})
				.fail(() => {
					result.value = "送信失敗";
					modal.classList.add("is-show");
				});
		} else {
			notSend();
		}
	};

	const notSend = () => {
		result.value = "登録番号がフォーマットと一致しません。";
		modal.classList.add("is-show");
	};

	const close = () => {
		modal.classList.remove("is-show");
	};

	modalClose.addEventListener("click", () => close());

	return {
		send,
	};
})();

MINERVA.dropdown.makeDropdown();
if (MINERVA.reader) MINERVA.reader.initCamera();
