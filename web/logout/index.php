<?php
session_start();
$_SESSION = array();
session_destroy();
?>

<!DOCTYPE html>
<html>
<head>
<title>ログアウト</title>
</head>
<body>
<h1>
ログアウトしました
</h1>
<p><a href='../login'>ログインページに戻る</a></p>
</body>
</html>