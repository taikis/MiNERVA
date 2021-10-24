<?php
session_start();
require '../../../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__. '/..');
$dotenv->load();


$id="";
$password="";
$auth="";
$error="";

if (isset($_POST["signUp"])) {
    if (empty($_POST["username"])) {
        $errorMessage = 'ユーザーIDが未入力です。';
    } else if (empty($_POST["password"])) {
        $errorMessage = 'パスワードが未入力です。';
    }else if (empty($_POST["group_name"])) {
        $errorMessage = '団体名が未入力です。';
    }

    if (!empty($_POST["username"]) && !empty($_POST["password"] && !empty($_POST["auth"])) && !empty($_POST["group_name"])){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $auth = $_POST['auth'];
        $group_name = $_POST['group_name'];
    }

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
        echo "接続成功".'<br>';

        $pass_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO nobu_logintest(ID,pass,auth,group_name) VALUES(:username,:pass,:auth,:group_name)');
        $stmt->bindValue(':username',(string)$username,PDO::PARAM_INT);
        $stmt->bindValue(':pass',(string)$pass_hash, PDO::PARAM_STR);
        $stmt->bindValue(':auth',(string)$auth, PDO::PARAM_INT);
        $stmt->bindValue(':group_name',(string)$group_name, PDO::PARAM_INT);
        $stmt->execute();
        echo "登録しました".'<br>';
    }catch(PDOException $e){
        echo 'データベースの接続に失敗しました:'.'<br>';
        echo $e->getMessage();
        exit();
    }
}
?>

<!doctype html>
<html>
    <head>
            <meta charset="UTF-8">
            <title>新規登録</title>
    </head>
    <body>
        <h1>新規登録画面</h1>
        <form id="loginForm" name="loginForm" action="" method="POST">
            <fieldset>
                <legend>新規登録フォーム</legend>
                <div><?php echo htmlspecialchars($errorMessage, ENT_QUOTES); ?></div>
                <div><?php echo htmlspecialchars($signUpMessage, ENT_QUOTES); ?></div>
                <label for="group_name">団体名</label><input type="group_name" id="group_name" name="group_name" value="" placeholder="名前を入力">
                <br>
                <label for="username">ユーザー名</label><input type="text" id="username" name="username" placeholder="ユーザー名を入力" value="<?php if (!empty($_POST["username"])) {echo htmlspecialchars($_POST["username"], ENT_QUOTES);} ?>">
                <br>
                <label for="password">パスワード</label><input type="password" id="password" name="password" value="" placeholder="パスワードを入力">
                <br>
                <label for="auth">権限</label><input type="auth" id="auth" name="auth" value="" placeholder="authを入力">
                <br>
                <input type="submit" id="signUp" name="signUp" value="新規登録">
            </fieldset>
        </form>
        <br>
        <!-- <form action="Login.php">
            <input type="submit" value="戻る">
        </form> -->
    </body>
</html>