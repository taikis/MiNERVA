const mailSub =
  "整理番号送付"

const mailTop =
  "様\n" +
  "（このメールは送信専用です。お問い合わせは下のメールアドレスまでお願いします。）\n" +
  "\n" +
  "整理番号と、QRコードをお送りします。\n" +
  "\n" +
  "注意\n" +
  "機種によっては２枚表示されることがございますが、どちらも同じ画像ですのでどちらを提示していただいても構いません。\n";

//整理番号 : id
//<img>

const mailBottom =
  "お問い合わせ\n" +
  "MAIL : hoge@gmail.com\n";

//////mail text end

function sendForm(e) {
  var ansData = e.response.getItemResponses();
  var address = ansData[0].getResponse();
  var name = ansData[1].getResponse();
  var id = assignId();
  var qrURL = "https://api.qrserver.com/v1/create-qr-code/?data=" +
    id +
    "&size=250x250&qzone=3";
  if (id != -1) {
    editSheet(id, ansData,qrURL);
    sendMail(address, name, id,qrURL);
  }
}

function assignId() {
  var lock = LockService.getDocumentLock();
  try {
    lock.waitLock(20000);
    var pro = PropertiesService.getScriptProperties();
    var id = pro.getProperty("id");
    id = Number(id) + 1;
    pro.setProperty("id", id);
    lock.releaseLock();
  } catch (e) {
    console.log("error : " + e.massage);
    id = -1
  }
  return id;
}

/**
 * シートに書き込み
 * @param {string} id 
 * @param {array} ansData
 */
function editSheet(id, ansData,qrURL) {
  var editArray = [];
  var ss = SpreadsheetApp.openById("ID");
  var sheet = ss.getSheetByName("freshersName");
  editArray.push(id);
  editArray.push("=IMAGE(\""+qrURL+"\")");
  for (i = 0; i < 5; ++i) {
    editArray.push(ansData[i].getResponse());
  }
  editArray.push(new Date());
  sheet.appendRow(editArray);
}
/**
 * メール送信
 * @param {string} id 
 * @param {string} name
 * @param {string} address
 */

function sendMail(address, name, id,qrURL) {
  var text = name + mailTop;
  text += "\n" + "整理番号 : " + id;
  text += "\n" + "<img src=" + qrURL + ">";
  text += "\n" + mailBottom;

  var qrImage = UrlFetchApp.fetch(qrURL).getBlob();
  var htmlBody = text.replace(/\r?\n/g, '<br>');
  var options = {
    htmlBody: htmlBody,
    attachments: [qrImage.setName(id + ".png")]
  };
  MailApp.sendEmail(address, mailSub, text, options);
}