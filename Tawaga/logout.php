<?php
    session_start();
    session_unset();
    session_destroy();
    unset($_COOKIE['username']);
    unset($_COOKIE['password']);
    setcookie('username', $username, false);
    setcookie('password', $password, false);
    ob_start();
    header("location: index.php");
    ob_end_flush();
    exit();
?>
