<?php
    header("Content-Type: application/json; charset=UTF-8");
    session_start();
    $place_data_json = file_get_contents("./js/data_club.json");
    $place_data_json = mb_convert_encoding($place_data_json, 'UTF8');
    $place_data = json_decode($place_data_json,true);
    $place_data_send = [];
    if($_SESSION['auth'] == 1 || $_SESSION['auth'] == 2 ){
        $place_data_send = $place_data;
    }elseif ($_SESSION['id'] && $_SESSION['auth'] == 0) {
        $key = array_search( $_SESSION['id'], array_column($place_data, 'group_id'));
        $place_data_send[] = $place_data[$key];
    }
    echo json_encode($place_data_send,JSON_UNESCAPED_UNICODE);
    exit;