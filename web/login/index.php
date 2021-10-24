<?php
require '../../../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__. '/..');
$dotenv->load();

session_start();


if(isset($_POST['login'])){
    if(empty($_POST['id'])){
        $error['id'] = '団体IDが未入力です';
    }
    if(empty($_POST['pass'])){
        $error['pass'] = 'パスワードが未入力です';
    }
    if (empty($_error['id']) and empty($_error['pass'])){
        $id = $_POST['id'];
        $password = $_POST['pass'];

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

                $stmt = $pdo->query("SELECT * FROM group_list WHERE id = $id");
                $row = $stmt->fetch();
                if ($id == $row['ID'] && password_verify($_POST['pass'], $row['pass'])){
                    $_SESSION['id'] = $row['ID'];
                    $_SESSION['auth'] = $row['auth'];
                    header("Location: ../home");
                    exit();
                } else {
                    $error['input'] = '団体IDもしくはパスワードが違います';
            }
        }catch(PDOException $e){
            echo 'データベース接続エラー'.$e->getMessage();
            exit();
        }
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>団体ログイン</title>
        <?php include('../lib/header.php');?>
        <link rel="stylesheet" href="css/style.css">

    </head>
    <body>
    <?php include('../lib/menubar.php');?>
        <h2 class="center">小金井祭　ログインフォーム</h2>
        <hr>
        <form name="loginform" action="" method="POST">
            <label for="id">　　　団体ID:</label>
            <div class="center">
                <input type="text" id="id" name="id">
            </div>
            <div class="center">
                <?php if(!empty($error['id'])){ ?>
                    <p class="emptyerror"><?php echo $error['id']; ?></p>
                <?php }else{
                    echo "<br>";
                } ?>
            </div>
            <label for="pass">　　　パスワード:</label>
            <div class="center">
                <input type="password" id="pass" name="pass">
            </div>
            <div class="center">
                <?php if(!empty($error['pass'])){ ?>
                    <p class="emptyerror"><?php echo $error['pass']; ?></p>
                <?php }else{
                    echo "<br>";
                } ?>
                <?php if(!empty($error['input'])){ ?>
                    <p class="inputerror"><?php echo $error['input']; ?>
                <?php }else{
                    echo "<br>";
                } ?>
            </div>
            <div class="center">
                <input type="submit" id="login" name="login" value="ログイン">
            </div>
        </form>
    </body>
</html>