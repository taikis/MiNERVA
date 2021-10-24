<?php
session_start();
$_SESSION = array();
session_destroy();
?>

<!DOCTYPE html>
<html>
<head>
<title>ログアウト</title>
<link rel="stylesheet" href="./css/style.css" />
<?php include('../lib/header.php');?>

</head>
<body>
<?php include('../lib/menubar.php');?>
<h2 class="center">ログアウト</h2>
<p><a href='../login'>ログインページに戻る</a></p>
</body>
</html>