
<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
        $id = $row['id'];
        $record = $row['record'];
        $credits = $row['credits'];
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://www.webcoder.sk/projects/js/projects.js" data-sitekey="HwQAFY9Hn2lNbdGWk80JK1hV2sk2oz"></script>
</head>

<body>
    <header>
    <?php if(!empty($_SESSION['user'])) { ?><a href="profile.php">Profile (<?php echo $user; ?>)</a><?php } else { ?><a href="signin.php?rf=custom">Sign In</a><?php } ?>
    </header>
    <nav>
        <p>Balance: <span class="init" id="balance"><?php echo (!empty($_SESSION['user'])) ? $credits : '0'; ?></span> <span class="init">Credits</span></p>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <legend autocomplete="off" style="align-items: flex-start;align-self: flex-start;">
            <input type="number" name="columns" placeholder="Columns" value="5" required />
            <input type="number" name="rows" placeholder="Rows" value="5" required />
            <input type="number" name="time" placeholder="Countdown (Minutes)" required />
            <button id="initBtn">Start</button>
            <p>Player Pos.: <span class="init">x=<span id="posx">1</span> y=<span id="posy">1</span></span></p>
            <p>Bomb. Pos.: <span class="init">x=<span id="bombx">0</span> y=<span id="bomby">0</span></span></p>
            <p>Time Left: <span class="init" id="timeleft">00:00</span></p>
            <p>Gems: <span class="init" id="gems">0</span></p>
            <p>Level: <span class="init" id="level">1</span></p>
            <p>Best Score: <span class="init" id="record"><?php echo (!empty($_SESSION['user'])) ? $record : '0'; ?></span></p>
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
            <p class="middle text-center">Set default parameters.</p>
        </div>
    </section>
    <footer>
        <p><b>Tips: </b>Arrows &gt; Moving,&nbsp;&nbsp;&nbsp;Enter &gt; Pause/Resume</p>
    </footer>
    <!-- SCRIPTS IMPORT -->
    <script src="jquery.min.js"></script>
    <script src="script.js"></script>
    <script>
        $(document).ready(function() {
            $('#enter').parent().css('width', '100%');
        });
        <?php
            if(!empty($_SESSION['user'])) {
                echo 'credits = '.$credits.';record='.$record.';';
            }
        ?>
    </script>
</body>

</html>
