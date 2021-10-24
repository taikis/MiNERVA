<?php
    session_start();
    if (!$_SESSION['id']) {
        header('Location: ../login');
    }
?>

<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>MiNERVA</title>
        <?php include('../lib/header.php');?>
        <link rel="stylesheet" href="./css/form.css" />
        <link rel="stylesheet" href="./css/app.css" />
        
    </head>
    <body>
        <!----->
        <?php include('../lib/menubar.php');?>
        <!----->
        <div class="reader">
            <div class="center">
            <form name="checkin-form">
                <label for="number">整理番号:<br>
                    <input type="text" id="number" name="number" placeholder="例) 123456" value="" class="text">
                </label>
                <input type="botton" id="checkin" name="checkin" onclick="send_data()" value="送信">
            </form>
            </div>
        </div>

        <div id="js-modal" class="modal-overlay">
            <div class="modal">
                <div class="modal-cnt">
                    <span class="modal-title" id="js-title"></span>
                    <span
                        id="js-result"
                        class="modal-result"
                        value=""
                        readonly
                    ></span>
                </div>
                <button id="js-entry" class="modal-btn" target="_blank">
                    登録
                </button>
                <button type="button" id="js-modal-close" class="modal-btn">
                    閉じる
                </button>
            </div>
        </div>

        <div id="js-alert" class="modal-overlay">
            <div class="modal">
                <div class="modal-cnt">
                    <span class="modal-title" id="js-alert-title"></span>
                    <span
                        id="js-alert-result"
                        class="modal-result"
                        value=""
                        readonly
                    ></span>
                </div>
                <button type="button" id="js-alert-close" class="modal-btn">
                    閉じる
                </button>
            </div>
        </div>

        <div id="dropdown" class="drop-overlay">
            <label for="drop-group" class="drop-label" >団体名:</label>
            <select name="group-id" id="drop-group">
                <option disabled selected value>選択してください</option>
            </select>
            <label for="drop-place" class="drop-label">場所名:</label>
            <select name="place-id" id="drop-place">
                <option disabled selected value>選択してください</option>
            </select>

        
        <script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"></script>      
        <script src="./js/app-form.js"></script>
    </body>
</html>
