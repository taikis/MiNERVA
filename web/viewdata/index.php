<?php
session_start();

if (!((bool)$_SESSION['id'] && ($_SESSION['auth'] >= 3))) {
    header('Location: ../login');
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>データ閲覧</title>
        <?php include('../lib/header.php');?>
        <link href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" />

    </head>
    <body>
    <?php include('../lib/menubar.php');?>

    <h2 class="center">データ閲覧</h2>
    <button id="entryBtn">入室データ</button>
    <button id="signupBtn">来場者データ</button>
    <div id="wrapper"></div>
    <script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"></script>      
    <script src="https://unpkg.com/gridjs/dist/gridjs.umd.js"></script>
    <script src="./js/app.js"></script>