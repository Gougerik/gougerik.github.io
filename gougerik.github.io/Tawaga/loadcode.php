
<?php
    include('config.php');
    if(!empty($_SESSION['empty']) && strlen($_SESSION['empty']) > 1 && !empty($_POST['code']) && strlen($_POST['code']) >= 1) {
        $code = $_POST['code'];
        if(!empty($_SESSION['user'])) {
            $user = $_SESSION['user'];
            $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
            $id = $row['id'];
            $record = $row['record'];
            $ccredits = $row['credits'];
            $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
            $credits = $credits.'k';
            $sounds = $row['sounds_fx'];
            $character = $row['character'];
        }
        $character = (!empty($_SESSION['user'])) ? $row['character'] : '1';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Load CODE</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .player {
            background-image: url('characters/dn<?php echo $character; ?>.svg');
        }
        .dir-up, .dir-down, .dir-left, .dir-right {
            background-image: url('characters/<?php echo $character; ?>.svg');
        }
    </style>
</head>

<body>
    <header>
        <a href="custom.php">Back</a>
        <?php if(!empty($_SESSION['user'])) { ?><a href="<?php echo 'user?id='.$id.'&rf=loadcode.php'; ?>">Profile (<?php echo $user; ?>)</a><?php } else { ?><a href="signin.php?rf=custom.php">Sign In</a><?php } ?>
    </header>
    <nav>
        <p class="beta">Load CODE</p>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
    <legend autocomplete="off" style="align-items: flex-start;align-self: flex-start;">
            <button id="initBtn">Start</button>
            <p>Player Pos.: <span class="init">x=<span id="posx">1</span> y=<span id="posy">1</span></span></p>
            <p>Time Left: <span 
            class="init" id="timeleft">00:00</span></p>
            <p>Gems: <span class="init" id="gems">0</span></p>
            <p>Goal: <span class="init" id="goal">0</span> <span class="init">Gems</span></p>
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
    <script src="jquery.min.js"></script>
    <script src="script.js"></script>
    <script>
        $(document).ready(function() {
            $('#enter').parent().css('width', '100%');
        });
        <?php
        if(!empty($_SESSION['user'])) {
            echo 'credits = '.$ccredits.';record='.$record.';';
            if($sounds == false) {
                echo 'sound = false;';
            }
        }
        ?>
        $(document).ready(function () {
        loadcode = true;
        campaign = true;
        var str = '<?php echo $code; ?>';
        var data = JSON.parse(str);
        $.each( data, function( key, val ) {
                window[key] = val;
            });
            var bmbs = "no";
            if(bombs) {
                bmbs = "yes";
            }
            $('p.middle.text-center').append("<span>Area size: <span class='init'>"+rows+'x'+cols+'</span></span>');
            $('p.middle.text-center').append("<span>Countdown: <span class='init'>"+cdtl+' min.</span></span>');
            $('p.middle.text-center').append("<span>Bombs: <span class='init'>"+bmbs+'</span></span>');
            $('p.middle.text-center').append("<span>Goal: <span class='init'>"+goal+' gems</span></span>');
            $('#goal').html(goal);
        });

        function GenWalls() {
            var wl = walls.length;
            var i = 0;
            while(i <= wl-1) {
                var ob = walls[i];
                var object = ob.split('|');
                $('#row'+object[1]+' > #block'+object[0]).addClass('wall');
                i += 1;
            }
        }
    </script>
</body>

</html>
<?php 
    unset($_SESSION['empty']);
    } else {
        $_SESSION['empty'] = 'ua';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Load CODE</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="modal" style="display: unset;">
        <form action="loadcode.php" style="width: 100%;" method="POST" autocomplete="off">
        <div class="modal-body">
                <textarea name="code" style="width: 100%;" rows="20" placeholder="Enter your CODE (JSON)" required></textarea>
                <button type="submit">Continue</button>
        </div>
        </form>
    </div>
</body>
<html>
<?php
    }
?>