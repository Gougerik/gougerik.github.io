<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $query = mysqli_query($con, "SELECT * FROM users WHERE username = '$user'");
        $row = mysqli_fetch_array($query);
        $record = $row['record'];
        $lb = mysqli_query($con, "SELECT COUNT(*) AS position FROM users WHERE record >= '$record'");
        $pos = mysqli_fetch_array($lb)['position'];
    }
    $query = mysqli_query($con, "SELECT * FROM users ORDER BY record DESC LIMIT 100");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Leaderboard</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            display: unset;
            height: 100%;
        }
    </style>
</head>

<body>
    <header>
        <a href="index.php">Home</a>
    </header>
    <footer>
        <div class="text-center">
            <?php if(!empty($_SESSION['user'])) { ?>
            <p>Your position: <span class="init"><?php echo $pos; ?>.</span></p>
            <?php } ?>
        </div>
    </footer>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <br><br>
    <div class="text-center">
        <h1>Leaderboard</h1>
    </div>
    <section id="leaderboard" style="height: 70%; max-height: 70%; overflow-y: auto;">
        <?php $i = 1; while($list = mysqli_fetch_object($query)) { ?>
            <p onclick="window.location.assign('user?id=<?php echo $list->id; ?>&rf=leaderboard');"><span style="color: var(--gray);">#<?php echo $i; ?></span> <?php echo $list->username; ?></p>
            <p class="init" style="background-color: var(--init);"><?php echo $list->record; ?></p>
        <?php $i += 1; } ?>
    </section>
    <!-- SCRIPTS IMPORT -->
    <script src="jquery.min.js"></script>    
    <script>
        $(document).ready(function () {
            $('#loader').css('display','none');
            $('#home').css('display','flex');
        });
    </script>
</body>
</html>