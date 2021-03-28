<?php
    require '../../../vendor/autoload.php';
    use Dotenv\Dotenv;
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    function setDB($fresher, $group, $place)
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
        } catch (PDOException $e) {
            header('Content-Type: text/plain; charset=UTF-8', true, 500);
            exit($e->getMessage());
        }
        $stmt = $pdo->prepare('INSERT INTO qr_entry VALUES (:entry_time,:fresher_id,:group_id,:place_id)');
        $stmt->bindValue(':entry_time', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $stmt->bindValue(':fresher_id', (string)$fresher, PDO::PARAM_STR);
        $stmt->bindValue(':group_id', (string)$group, PDO::PARAM_STR);
        $stmt->bindValue(':place_id', (string)$place, PDO::PARAM_STR);
        $stmt->execute();
    }


    header('Content-type: text/plain; charset= UTF-8');
    if (isset($_POST['fresher_id']) && isset($_POST['group_id'])&& isset($_POST['place_id'])) {
        setDB($_POST['fresher_id'], $_POST['group_id'], $_POST['place_id']);
        echo "success";
    } else {
        echo "fail";
    }
