
<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
        $sounds = $row['sounds_fx'];
        $id = $row['id'];
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Custom Game</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .melee > .player {
            background-image: url('characters/dn1.svg');
        }
        .melee > .dir-up, .melee > .dir-down, .melee > .dir-left, .melee > .dir-right {
            background-image: url('characters/1.svg');
        }
        .andrew > .player {
            background-image: url('characters/dn2.svg');
        }
        .andrew > .dir-up, .andrew > .dir-down, .andrew > .dir-left, .andrew > .dir-right {
            background-image: url('characters/2.svg');
        }
        .andrew.melee > .player, .melee.andrew .player {
            background-image: url('characters/dn3.svg') !important;
        }
    </style>
</head>

<body>
    <header>
        <a href="index.php">Home</a>
    <?php if(!empty($_SESSION['user'])) { ?><a href="<?php echo 'user?rf=competitive.php&id='.$id; ?>">Profile (<?php echo $user; ?>)</a><?php } else { ?><a href="signin.php?rf=custom.php">Sign In</a><?php } ?>
    </header>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <legend autocomplete="off" style="align-items: flex-start;align-self: flex-start;">
            <div>
                <label for="bombs">Bombs: </label>
                <input type="checkbox" name="bombs" id="bombs" onchange="Switch('bombs','bombs');" hidden />
                <div style="display: inline-block;">
                    <div class="ccb-wrapper" onclick="$('#bombs').click();">
                        <div class="jockey toggle-on" id="toggle-bombs"></div>
                    </div>
                </div>
            </div>
            <input type="number" name="columns" placeholder="Columns" value="5" required />
            <input type="number" name="rows" placeholder="Rows" value="5" required />
            <input type="number" name="time" placeholder="Countdown (Minutes)" required />
            <button id="initBtn">Start</button>
            <p>Player 1 Pos.: <span class="init">x=<span id="posx1">1</span> y=<span id="posy1">1</span></span></p>
            <p>Player 2 Pos.: <span class="init">x=<span id="posx2">1</span> y=<span id="posy2">1</span></span></p>
            <p>Bomb. Pos.: <span class="init">x=<span id="bombx">0</span> y=<span id="bomby">0</span></span></p>
            <p>Time Left: <span class="init" id="timeleft">00:00</span></p>
            <p>Gems 1: <span class="init" id="gems1">0</span></p>
            <p>Gems 2: <span class="init" id="gems2">0</span></p>
        </legend>
        <legend style="align-items: center;align-self: flex-end;">
            <div><button class="arrow" id="up">&uarr;</button><br></div>
            <div class="row">
                <button class="arrow" id="left">&larr;</button>&nbsp;
                <button class="arrow" id="down">&darr;</button>&nbsp;
                <button class="arrow" id="right">&rarr;</button>
            </div>
            <br/>
            <div><button class="wasd" id="up">W</button><br></div>
            <div class="row">
                <button class="wasd" id="left">A</button>&nbsp;
                <button class="wasd" id="down">S</button>&nbsp;
                <button class="wasd" id="right">D</button>
            </div>
        </legend>
        <div id="canvas">
            <p class="middle text-center">Set default parameters.</p>
        </div>
    </section>
    <footer>
        <p><b>Tips: </b>Arrows &gt; Moving Player 1,&nbsp;&nbsp;&nbsp;WASD &gt; Moving Player 2,&nbsp;&nbsp;&nbsp;Enter &gt; Pause/Resume</p>
    </footer>
    <!-- SCRIPTS IMPORT -->
    <script src="jquery.min.js"></script>
    <script src="competitive.js"></script>
    <script>
        $(document).ready(function() {
            $('#enter').parent().css('width', '100%');
        });
        <?php
            if($sounds == false) {
                echo 'sound = false;';
            }
        ?>
        bombs = true;
        competitive = true;
    </script>
</body>

</html>
