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
        <?php include('../lib/header.php');?>
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
    <?php include('../lib/menubar.php');?>

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
    </body>
</html>