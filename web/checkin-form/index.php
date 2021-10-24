<?php
    session_start();
    if(!$_SESSION['id']){
        header('Location: ../login'); 
    }
    require '../../../vendor/autoload.php';
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__. '/..');
    $dotenv->load();
    try {
        $pdo = new PDO(
            $_ENV["DB_DSN"],
            $_ENV["DB_USERNAME"],
            $_ENV["DB_PASSWORD"],
            [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    } catch (PDOException $e) {
        echo 'データベース接続エラー'.$e->getMessage();
        exit();
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>入場フォーム</title>
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
        <h2 class="center">小金井祭　入場フォーム</h2>
