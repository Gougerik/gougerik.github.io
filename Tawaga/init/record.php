<?php
    include('../config.php');
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(!empty($_SESSION['user']) && !empty($_POST['record'])) {
            $user = $_SESSION['user'];
            $record = $_POST['record'];
            $query = mysqli_query($con, "UPDATE users SET record = '$record' WHERE username = '$user'");
            echo 's';
        }
    }
?>