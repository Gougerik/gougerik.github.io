<?php
    session_start();
    $con = mysqli_connect('mariadb103.websupport.sk','tawaga','Bukaj-59687323','tawaga',3313)or die('Connection error');
    if(isset($_COOKIE['username']) && isset($_COOKIE['password'])) {
        $username = $_COOKIE['username'];
        $password = $_COOKIE['password'];
        $verify_cookie = mysqli_query($con, "SELECT * FROM users WHERE username = '$username' AND password = '$password'");
        if(mysqli_num_rows($verify_cookie) == 1) {
            $_SESSION['user'] = $username;
        }
    }
?>