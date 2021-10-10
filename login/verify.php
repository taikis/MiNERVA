<?php
session_start();

echo '団体id: '.$_SESSION['id'].'<br>';

echo '権限: '.$_SESSION['auth'].'<br>';

