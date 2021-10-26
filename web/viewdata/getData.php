<?php
session_start();
if (!((bool)$_SESSION['id'] && ($_SESSION['auth'] >= 3))) {
    header('Content-Type: text/plain; charset=UTF-8', true, 403);
} else {
    header("Content-Type: application/json; charset=UTF-8");
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
    header('Content-Type: text/plain; charset=UTF-8', true, 500);
    echo $e->getMessage();
    exit($e->getMessage());
}

$table = array();
$place_data_json = file_get_contents("../checkin/js/data_club.json");
$place_data_json = mb_convert_encoding($place_data_json, 'UTF8');
$place_data = json_decode($place_data_json, true);

if ($_GET['dataType'] == 'entry') {
    try {
        $stmt = $pdo->query("SELECT * FROM participant_entry");
        $table =$stmt->fetchALL();
    } catch (PDOException $e) {
        header('Content-Type: text/plain; charset=UTF-8', true, 500);
        echo $e->getMessage();
        exit($e->getMessage());
    }
    for ($i=0; $i < count($table); $i++) {
        $key_group = array_search($table[$i]['group_id'], array_column($place_data, 'group_id'));
        $table[$i]['group_id'] = $place_data[$key_group]['group_name'];
        $key_place = array_search($table[$i]['place_id'], array_column($place_data[$key_group]['place'], 'place_id'));
        $table[$i]['place_id']  = $place_data[$key_group]['place'][$key_place]['place_name'];
    }
}

if ($_GET['dataType'] == 'signup') {
    try {
        $stmt = $pdo->query("SELECT * FROM participant_signup");
        $table =$stmt->fetchALL();
    } catch (PDOException $e) {
        header('Content-Type: text/plain; charset=UTF-8', true, 500);
        echo $e->getMessage();
        exit($e->getMessage());
    }
}
echo json_encode($table);
