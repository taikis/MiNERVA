<?php

session_start();

if (!empty($_SESSION['name_kanji'])){
    $thx_message = $_SESSION['name_kanji'].' さん';
}else{
    $error['access'] ='正しくアクセスしてください';
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>thank you!</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <table border="0">
            <tr>
                <td>
                    <div id="Menu">
                        <input type="checkbox" id="Check">
                        <label id="Open" for="Check"><img src="img/menu2.png" alt="メニュー" width="50" height="50"></label>
                        <label id="Close" for="Check"></label>
                        <nav>
                            <ul>
                                <li><a href="#">ホーム</a></li>
                                <li><a href="#">入場フォーム</a></li>
                                <li><a href="#">ログイン</a></li>
                                <li><a href="#">MiNERVA概要</a></li>
                                <li><a href="https://hosei-u.com/">企画実行委員会ホームページ</a></li>
                                <li><a href="https://koganeisai.hosei-u.com/">小金井祭ホームページ</a></li>
                            </ul>
                        </nav>
                    </div>
                </td>
                <td><a href="https://hosei-u.com/"><div class="icon"><img src="img/kikaku.JPG"></div></a></td>
            </tr>
        </table>
    </body>
    <h2 class="center"><?php echo $thx_message; ?></h2>
    <h4 class="center">小金井祭へのご参加ありがとうございます！</h4>
    <hr>
    <p class="center">ご登録が完了しました！</p>
    <p class="center">このページは閉じていただいて大丈夫です。<br>小金井祭をお楽しみください！</p>
    <p class="center">小金井祭ホームページは<a href="https://koganeisai.hosei-u.com/">こちら</a>。</p>

    <div class="center">
        <?php if(!empty($error['access'])){ ?>
            <p class="error"><?php echo $error['access']; ?>
        <?php } ?>
    </div>

</html>