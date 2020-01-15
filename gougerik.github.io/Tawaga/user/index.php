<?php
    include('../config.php');
    if(empty($_GET['id'])) {
        header('location: ../index.php');
    }
    if(!empty($_SESSION['user'])) {
        $user = $_SESSION['user'];
    }
    $rf = (!empty($_GET['rf'])) ? $_GET['rf'] : 'index';
    $id = $_GET['id'];
    $query = mysqli_query($con, "SELECT * FROM users WHERE id = '$id'");
    $row = mysqli_fetch_array($query);
    $username = $row['username'];
    $record = $row['record'];
    $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
    $credits = $credits.'k';
    $lb = mysqli_query($con, "SELECT COUNT(*) AS position FROM users WHERE record >= '$record'");
    $pos = mysqli_fetch_array($lb)['position'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - <?php echo $row['username']; ?></title>
    <link rel="stylesheet" href="../style.css">
</head>

<body>
    <header>
        <a href="../<?php echo $rf; ?>.php">Back</a>
    </header>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <nav>
<?php if(!empty($_SESSION['user'])) { ?>
        <button onclick="window.location.assign('settings.php');">Settings</button>
        <button onclick="window.location.assign('../logout.php');">Logout</button>
<?php } ?>
    </nav>
    <section id="home">
        <h2 class="init"><?php echo $username; ?></h2><h3 style="color: var(--gray);">#<?php echo $row['id']; ?></h3><br/>
        <p>Credits: <span class="init"><?php echo $credits; ?></span></p>
        <p>High Score: <span class="init"><?php echo $record; ?></span></p>
        <p>Campaign Level: <span class="init"><?php echo $row['level']; ?></span></p>
        <p>Position in LeaderBoard: <span class="init"><?php echo $pos; ?></span></p>
    </section>
    <!-- SCRIPTS IMPORT -->
    <script src="../jquery.min.js"></script>    
    <script>
        $(document).ready(function () {
            $('#loader').css('display','none');
            $('#home').css('display','flex');
        });
    </script>
</body>
</html>