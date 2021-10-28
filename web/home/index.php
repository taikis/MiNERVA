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
        <link rel="stylesheet" href="./css/style.css" />
    </head>
    <body>
    <?php include('../lib/menubar.php');?>
        <div><p>ようこそ、<?php
        $stmt = $pdo->query("SELECT * FROM group_list WHERE id = '". $_SESSION['id'] ."'");
        $row = $stmt->fetch();
        $_SESSION['group_name'] = $row['group_name'];
        echo $_SESSION['group_name'] ;
        ?>さん</p>
        </div>
        <div class = 'column'>
            <a href="../checkin/" >QRコードスキャン<br>
            来場者の登録はここから行ってください。</a>
        </div>
        <div class = 'column'>
            <a href="../checkin/use-form.php">手動入力<br>
            上のQRコードスキャンがうまくいかない場合、こちらをお使いください。</a>
        </div>

        <?php if ($_SESSION[auth] >= 3) { ?>
        <div class = 'column'>
            <a href="../viewdata">データベース閲覧<br>
            企画実行委員会専用ページ</p></a>
        </div>
        <?php } ?>
        <?php if ($_SESSION[auth] == 9) { ?>
            <div class = 'column'>
            <a href="../login/signUp.php">新規ユーザー作成<br>
            企画実行委員会専用ページ</p></a>
        </div>
        <?php } ?>
        <p>ログアウトは、左上のメニューから行ってください。</p>
</body>
</html>