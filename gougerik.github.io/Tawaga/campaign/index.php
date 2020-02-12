
<?php
    include('../config.php');
    if(empty($_SESSION['user'])) {
        header('location: ../signin.php');
    }
    $user = $_SESSION['user'];
    $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
    $id = $row['id'];
    $record = $row['record'];
    $ccredits = $row['credits'];
    $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
    $credits = $credits.'k';
    $sounds = $row['sounds_fx'];
    $level = $row['level'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Campaign</title>
    <link rel="stylesheet" href="../style.css">
</head>

<body>
    <header>
        <a href="../index.php">Home</a> <a href="<?php echo '../user?rf=campaign&id='.$id; ?>">Profile (<?php echo $user; ?>)</a>
    </header>
    <nav>
        <p>Balance: <span class="init" id="balance"><?php echo $credits; ?></span> <span class="init">Credits</span></p>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
       <h2>Campaign</h2>
       <h3 class="init">Select level</h3>
       <br/>
       <div class="flex-wrapper" style="flex-wrap: wrap; margin: 0 4rem;">
        <?php $i = 1; while($i <= 12) { if($level >= $i) { ?>
            <a style="flex: 1 0 21%; " href="level.php?level=<?php echo $i; ?>" class="bordered"><p><?php echo $i; ?></p></a>
        <?php } else { ?>
            <div style="flex: 1 0 21%; " class="bordered locked"><p>Locked (<?php echo $i; ?>)</p></div>
        <?php } $i += 1; } ?>
       </div>
    </section>
    <footer>
        <p><b>Tips: </b>Arrows &gt; Moving,&nbsp;&nbsp;&nbsp;Enter &gt; Pause/Resume</p>
    </footer>
    <!-- SCRIPTS IMPORT -->
    <script src="../jquery.min.js"></script>
    <script src="../script.js"></script>
    <script>
        $(document).ready(function() {
            $('#enter').parent().css('width', '100%');
        });
        <?php
            if(!empty($_SESSION['user'])) {
                echo 'credits = '.$ccredits.';record='.$record.';';
            }
            if($sounds == false) {
                echo 'sound = false;';
            }
        ?>
    </script>
</body>

</html>
