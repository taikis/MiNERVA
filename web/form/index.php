<?php
require '../../../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__. '/..');
$dotenv->load();

session_start();

if (isset($_GET['number'])){
    $reference_number = $_GET['number'];
}else{
    $error['reference_number'] = "整理番号がありません。正しくアクセスしてください。";
}

if (isset($_POST['signup'])) {
    $_SESSION['number'] = $_POST['number'];
    $_SESSION['name_kanji'] = $_POST['name_kanji'];
    $_SESSION['name_kana'] = $_POST['name_kana'];
    $_SESSION['phone'] = $_POST['phone'];
    $_SESSION['temp'] = $_POST['temp'];
    $_SESSION['healthy'] = $_POST['healthy'];

    if (!preg_match("/[A-Z]\d{6}\z/", $_POST['number'])){
        $error['number'] = '正しく入力してください';
    }
    if (!preg_match("/\d{2}\.\d\z/", $_POST['temp'])){
        $error['temp'] = '正しく入力してください';
    }
    if (!preg_match("/^0\d{9,10}\z/", $_POST['phone'])){
        $error['phone'] = '正しく入力してください';
    }

    if (empty($_POST['number'])) {
        $error['number'] = '予約番号が未入力です';
    }
    if (empty($_POST['name_kanji'])) {
        $error['name_kanji'] = '名前が未入力です';
    }
    if (empty($_POST['name_kana'])) {
        $error['name_kana'] = '名前(カナ)が未入力です';
    }
    if (empty($_POST['phone'])) {
        $error['phone'] = '電話番号が未入力です';
    }
    if (empty($_POST['temp'])) {
        $error['temp'] = '体温が未入力です';
    }
    if (empty($_POST['healthy'])){
        $error['healthy'] = '健康でない場合はできません';
    }
    

    if (empty($error['reference_number']) and empty($error['number']) and empty($error['name_kanji']) and empty($error['name_kana']) and empty($error['phone']) and empty($error['temp']) and empty($error['healthy'])){
        $number = $_POST['number'];
        $name_kanji = $_POST['name_kanji'];
        $name_kana = $_POST['name_kana'];
        $phone = $_POST['phone'];
        $temp = $_POST['temp'];
    
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

            $stmt = $pdo->prepare('SELECT * FROM participant_signup WHERE reference_number = :rnumber');
            $stmt->bindValue(':rnumber',$reference_number,PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->fetch() > 0){
                $error['input'] = "整理番号 $reference_number はすでに登録されています。";
            }else{
                $stmt2 = $pdo->prepare('INSERT INTO participant_signup(reference_number,confirmation_number,name_kanji,name_kana,phone_number,body_temperture) VALUES(:rnumber,:cnumber,:name_kanji,:name_kana,:phone,:temp)');
                $stmt2->bindValue(':rnumber',$reference_number,PDO::PARAM_STR);
                $stmt2->bindValue(':cnumber',$number,PDO::PARAM_STR);
                $stmt2->bindValue(':name_kanji',$name_kanji, PDO::PARAM_STR);
                $stmt2->bindValue(':name_kana',$name_kana, PDO::PARAM_STR);
                $stmt2->bindValue(':phone',$phone, PDO::PARAM_STR);
                $stmt2->bindValue(':temp',$temp, PDO::PARAM_STR);
                $stmt2->execute();
                header("Location: thanks.php");
                exit();
            }
        }catch(PDOException $e){
            echo $e->getMessage();
            exit();
        }
    }
}

?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>入場フォーム</title>
        <link rel="stylesheet" href="css/style.css">
        <?php include('../lib/header.php');?>
    </head>
    <body>
    <?php include('../lib/menubar.php');?>
        <h2 class="center">小金井祭　入場フォーム</h2>
        <hr>
        <form name="signup" action="" method="POST">
            <div>
                <div class="background">
                    <label for="rnumber">　１. 整理番号:<br>
                </div>
                <div class="center">
                    <p class="reference"><?php echo $reference_number; ?></p>
                    <?php if (!empty($error['reference_number'])){ ?>
                        <p class="error"><?php echo $error['reference_number']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <div>
                <div class="background">
                    <label for="number">　２. 予約番号:<br>
                </div>
                <div class="center">
                    <input type="text" id="number" name="number" placeholder="例) A123456" value="<?php if (!empty($_SESSION['number'])){ echo $_SESSION['number'];} ?>" class="text">
                    <?php if (!empty($error['number'])){ ?>
                        <p class="error"><?php echo $error['number']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <div>
                <div class="background">
                    <label for="name_kanji">　３. お名前:<br>
                </div>
                <div class="center">
                    <input type="text" id="name_kanji" name="name_kanji" placeholder="例) 法政太郎" value="<?php if (!empty($_SESSION['name_kanji'])){ echo $_SESSION['name_kanji'];} ?>" class="text">
                    <?php if (!empty($error['name_kanji'])){ ?>
                        <p class="error"><?php echo $error['name_kanji']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <div>
                <div class="background">
                    <label for="name_kana">　４. お名前(カタカナ):<br>
                </div>
                <div class="center">
                    <input type="text" id="name_kana" name="name_kana" placeholder="例) ホウセイタロウ" value="<?php if (!empty($_SESSION['name_kana'])){ echo $_SESSION['name_kana'];} ?>" class="text">
                    <?php if (!empty($error['name_kana'])){ ?>
                        <p class="error"><?php echo $error['name_kana']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <div>
                <div class="background">
                    <label for="phone">　５. 電話番号:<br>
                </div>
                <div class="center">
                    <input type="text" id="phone" name="phone" placeholder="例) 09012345678" value="<?php if (!empty($_SESSION['phone'])){ echo $_SESSION['phone'];} ?>" class="text">
                    <div class="warning">
                        <p>-(ハイフン)なしで入力してください</p>
                    </div>
                    <?php if (!empty($error['phone'])){ ?>
                        <p class="error"><?php echo $error['phone']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <div>
                <span>
                    <div class="background">
                        <label for="temp">　６. 体温:<br>
                    </div>
                    <div class="center">
                        <input type="text" id="temp" name="temp" placeholder="例) 36.0" value="<?php if (!empty($_SESSION['temp'])){ echo $_SESSION['temp'];} ?>" class="temp">　度
                        <div class="warning">
                            <p>半角数字記号を使って入力してください</p>
                        </div>
                        <?php if (!empty($error['temp'])){ ?>
                            <p class="error"><?php echo $error['temp']; ?></p>
                        <?php } ?>
                    </div>
                </span>
            </div>
            <div>
                <div class="background">
                    <label for="healthy">　７. 健康確認:<br>
                </div>
                <div class="center">
                    <input type="checkbox" id="healthy" name="healthy" value="healthy" <?php if (!empty($_SESSION['healthy'])){ echo "checked";} ?>>　健康です
                    <?php if (!empty($error['healthy'])){ ?>
                        <p class="error"><?php echo $error['healthy']; ?></p>
                    <?php } ?>
                </div>
            </div>
            <br>
            <div class="center">
                <?php if(!empty($error['input'])){ ?>
                    <p class="inputerror"><?php echo $error['input']; ?>
                <?php } ?>
            </div>
            <div class="center">
                <input type="submit" id="signup" name="signup" value="送信">
            </div>
        </form>
    </body>
</html>
