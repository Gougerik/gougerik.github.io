
<?php
    include('../config.php');
    if(empty($_SESSION['user'])) {
        header('location: ../signin.php');
    }
    if(empty($_GET['level'])) {
        header('location: index.php');
    }
    $user = $_SESSION['user'];
    $level = $_GET['level'];
    $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
    $id = $row['id'];
    $record = $row['record'];
    $ccredits = $row['credits'];
    $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
    $credits = $credits.'k';
    $sounds = $row['sounds_fx'];
    $character = $row['character'];
    if(!(intval($row['level']) >= intval($level))) {
        header('location: index.php');
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Campaign</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .player {
            background-image: url('../characters/dn<?php echo $character; ?>.svg');
        }
        .dir-up, .dir-down, .dir-left, .dir-right {
            background-image: url('../characters/<?php echo $character; ?>.svg');
        }
    </style>
</head>

<body>
    <header>
    <a href="index.php">Back</a> <a href="<?php echo '../user?id='.$id.'&rf=campaign/level.php%3Flevel='.$level; ?>">Profile (<?php echo $user; ?>)</a>
    </header>
    <nav>
        <p>Balance: <span class="init" id="balance"><?php echo $credits; ?></span> <span class="init">Credits</span></p>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
    <legend autocomplete="off" style="align-items: flex-start;align-self: flex-start;">
            <button id="initBtn">Start</button>
            <p>Player Pos.: <span class="init">x=<span id="posx">1</span> y=<span id="posy">1</span></span></p>
            <p>Time Left: <span class="init" id="timeleft">00:00</span></p>
            <p>Gems: <span class="init" id="gems">0</span></p>
            <p>Goal: <span class="init" id="goal">0</span> <span class="init">Gems</span></p>
            <p>Level: <span class="init" id="level"><?php echo $row['level']; ?></span></p>
            <p>Best Score: <span class="init" id="record"><?php echo $record; ?></span></p>
            <div id="ifbombs" style="display: none;">
                <p>Bomb minimap:</p>
                <div id="minimap"></div>
            </div>
        </legend>
        <legend style="align-items: center;align-self: flex-end;">
            <div><button class="arrow" id="up">&uarr;</button><br></div>
            <div class="row">
                <button class="arrow" id="left">&larr;</button>&nbsp;
                <button class="arrow" id="down">&darr;</button>&nbsp;
                <button class="arrow" id="right">&rarr;</button>
            </div>
            <div style="width: 1OO% !important;"><button class="arrow" id="enter" style="width: 100%;" onclick="Pause();">Pause &#x23CE;</button></div>
        </legend>
        <div id="canvas">
            <p class="middle text-center">
                <span class="init">Level info</span>
                <br>
            </p>
        </div>
    </section>
    <footer>
        <p><b>Tips: </b>Arrows &gt; Moving,&nbsp;&nbsp;&nbsp;Enter &gt; Pause/Resume</p>
    </footer>
    <!-- SCRIPTS IMPORT -->
    <script src="../jquery.min.js"></script>
    <script src="../script.js"></script>
    <script src="script.js"></script>
    <script>
        $(document).ready(function() {
            $('#enter').parent().css('width', '100%');
        });
        <?php
            echo 'credits = '.$ccredits.';record='.$record.';'.'level='.$level.';';
            if($sounds == false) {
                echo 'sound = false;';
            }
        ?>
    </script>
</body>

</html>
