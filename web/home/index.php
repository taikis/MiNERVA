<?php
    session_start();
    if (!$_SESSION['id']) {
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
<html lang="ja">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>MiNERVA</title>
        <?php include('../lib/header.php');?>
        <link rel="stylesheet" href="./css/app.css" />
    </head>
    <body>
    <?php include ('../lib/menubar.php');?>
        <div><p>ようこそ、<?php
        $stmt = $pdo->query("SELECT * FROM group_list WHERE id = '". $_SESSION['id'] ."'");
        $row = $stmt->fetch();
        $_SESSION['group_name'] = $row['group_name'];
        echo $_SESSION['group_name'] ;
        ?>さん</p>
        <a href="../logout"><p>ログアウト</p></a>
        </div>
        <div>
            <a href="../checkin/"><p>QRコードスキャン</p></a>
            <p>来場者の登録はここから行ってください。</p>
        </div>
        <div>
            <a href="../checkin/use-form.php"><p>手動入力</p></a>
            <p>上のQRコードスキャンがうまくいかない場合、こちらをお使いください。</p>
        </div>

        <?php if ($_SESSION[auth] >= 3) { ?>
        <div>
            <a href="../check-data"><p>データベース閲覧</p></a>
            <p>企画実行委員会専用ページ</p>
        </div>
        <?php } ?>
        <?php if ($_SESSION[auth] == 9) { ?>
        <div>
            <a href="../check-data"><p>新規ユーザー作成</p></a>
            <p>企画実行委員会専用ページ</p>
        </div>
        <?php } ?>

</body>
</html>