<?php
    include('../config.php');
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(!empty($_SESSION['user']) && !empty($_POST['passed'])) {
            $user = $_SESSION['user'];
            $passed = $_POST['passed'];
            $check = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
            if($check['level'] == $passed) {
                $query = mysqli_query($con, "UPDATE users SET level = level + 1 WHERE username = '$user'");
                echo 'ss';
            }
            echo 's';
        }
    }
?>