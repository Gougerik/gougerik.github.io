<?php
    include('../config.php');
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(!empty($_SESSION['user']) && !empty($_POST['credits'])) {
            $user = $_SESSION['user'];
            $credits = $_POST['credits'];
            $query = mysqli_query($con, "UPDATE users SET credits = '$credits' WHERE username = '$user'");
            echo 's';
        }
    }
?>