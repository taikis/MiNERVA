function sendForm(e) {
  var ansData = e.response.getItemResponses();
  editSheet(ansData);
}

/**
 * シートに書き込み
 * @param {array} ansData
 */
function editSheet(ansData) {
  var editArray = [];
  var ss = SpreadsheetApp.openById("ID");
  var sheet = ss.getSheetByName("NoPhone");
  var id =ansData[0].getResponse();
  var row = Number(id)-200000 + 1;
  for (i = 1; i < 6; ++i) {
    editArray.push(ansData[i].getResponse());
  }
  editArray.push(ansData[7].getResponse());
  editArray.push(new Date());
  sheet.getRange(row,3,1,editArray.length).setValues([editArray]);
}

function set(){
  
}