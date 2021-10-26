function getData(dataType) {
	var data;
	var columns;
	var url = "";
	// switch (dataType) {
	// 	case "entry":
	// 		columns = ["時間", "来場者予約番号", "団体番号", "場所名"];
	// 		break;
	// 	case "signup":
	// 		columns = ["整理番号", "来場者予約番号", "お名前", "電話番号"];
	// 	default:
	// 		break;
	// }
	$.ajax({
		type: "GET",
		url: "./getData.php",
		data: {
			dataType: dataType,
		},
		async: false,
		success: function (table) {
			data = table;
		},
	});
	if (data) {
		return data;
	}
}
var isFirst = true;
var grid = new gridjs.Grid({
	search: true,
	sort: true,
	pagination: {
		limit: 20,
	},
	data: [[]],
});
function setData(dataType) {
	tableData = getData(dataType);


	grid.updateConfig({
		data: tableData,
	});
	if (isFirst) {
		grid.render(document.getElementById("wrapper"));
		isFirst = false;
	} else {
		grid.forceRender(document.getElementById("wrapper"));
	}
}

var dataType = "entry";

setData(dataType);

const entryBtn = document.getElementById("entryBtn");
const signupBtn = document.getElementById("signupBtn");

entryBtn.addEventListener(
	"click",
	(func = () => {
		var dataType = "entry";
		setData(dataType);
	})
);
signupBtn.addEventListener(
	"click",
	(func = () => {
		var dataType = "signup";
		setData(dataType);
	})
);
