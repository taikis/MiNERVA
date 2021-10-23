<?php
require '../../../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__. '/..');
$dotenv->load();

session_start();


if(isset($_POST['login'])){
    if(empty($_POST['id'])){
        $error_id = '団体IDが未入力です';
    } elseif(empty($_POST['pass'])){
        $error_pass = 'パスワードが未入力です';
    } else {
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
            if(is_numeric($id)){
                $stmt = $pdo->query("SELECT * FROM nobu_logintest WHERE id = $id");
                $row = $stmt->fetch();
                if ($id == $row['ID'] && password_verify($_POST['pass'], $row['pass'])){
                    $_SESSION['id'] = $row['ID'];
                    $_SESSION['auth'] = $row['auth'];
                    header("Location: ../home");
                    exit();
                } else {
                    echo '団体IDもしくはパスワードが違います';
                    $error = '団体IDもしくはパスワードが違います';
                }
            }else{
                $error = '団体IDもしくはパスワードが違います';
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
    </head>
    <body>
        <h2>小金井祭　ログインフォーム</h2>
        <form name="loginform" action="" method="POST">
            <div>
                <label for="ID">団体ID:</label>
                <input type="text" id="id" name="id">
                <?php if(!empty($error_id)){ ?>
                    <p><?php echo $error_id; ?></p>
                <?php } ?>
            </div>
            <div>
                <label for="password">パスワード:</label>
                <input type="password" id="pass" name="pass">
                <?php if(!empty($error_pass)){ ?>
                    <p><?php echo $error_pass; ?></p>
                <?php } ?>
                <?php if(!empty($error)){ ?>
                    <p><?php echo $error; ?></p>
                <?php }?>
            </div>
            <input type="submit" id="login" name="login" value="ログイン">
        </form>
    </body>
</html>