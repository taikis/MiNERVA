<?php
    require '../../../vendor/autoload.php';
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__. '/..');
    $dotenv->load();
    function checkId($pdo,$reference_number){
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM participant_signup WHERE reference_number = :reference_number");
        $stmt->bindValue(':reference_number', (string)$reference_number, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }
    function setDB($visitor, $group, $place)
    {
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
            if(!checkId($pdo,$visitor)){
                return false;
            };
            $stmt = $pdo->prepare('INSERT INTO participant_entry VALUES (:entry_time,:visitor_id,:group_id,:place_id)');
            $stmt->bindValue(':entry_time', date('Y-m-d H:i:s'), PDO::PARAM_STR);
            $stmt->bindValue(':visitor_id', (string)$visitor, PDO::PARAM_STR);
            $stmt->bindValue(':group_id', (string)$group, PDO::PARAM_STR);
            $stmt->bindValue(':place_id', (string)$place, PDO::PARAM_STR);
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            header('Content-Type: text/plain; charset=UTF-8', true, 500);
            echo $e->getMessage();
            exit($e->getMessage());
        }


    }


    header('Content-type: text/plain; charset= UTF-8');
    if (isset($_POST['visitor_id']) && isset($_POST['group_id'])&& isset($_POST['place_id'])) {
        $isExist = setDB($_POST['visitor_id'], $_POST['group_id'], $_POST['place_id']);
        if ($isExist) {
            echo "success";
        }else{
            echo "no data";
        }
    } else {
        echo "fail";
    }
