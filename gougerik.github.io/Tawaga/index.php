
<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $row = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE username = '$user'"));
        $id = $row['id'];
        $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
        $credits = $credits.'k';
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
    <?php if(!empty($_SESSION['user'])) { ?><a href="<?php echo 'user?rf=custom&id='.$id; ?>">Profile (<?php echo $user; ?>)</a><?php } else { ?><a href="signin.php?rf=custom">Sign In</a><?php } ?>
    </header>
    <nav>
    <?php if(!empty($_SESSION['user'])) { ?><p>Balance: <span class="init" id="balance"><?php echo (!empty($_SESSION['user'])) ? $credits : '0'; ?></span> <span class="init">Credits</span></p><?php } ?>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <h1>Tawaga</h1>
        <h3 class="init">Select game</h3><br/>
        <div class="flex-wrapper">
            <a href="custom.php" class="bordered"><p>Custom</p><img src="img/custom.svg" class="img-fluid" width="300px" alt="Image"></a>
            <?php if(!empty($_SESSION['user'])) { ?>
            <a href="campaign" class="bordered"><p>Campaign</p><img src="img/campaign.svg" class="img-fluid" width="300px" alt="Image"></a>
            <?php } else { ?>
            <div class="bordered locked"><p>Locked (Campaign)</p><img src="img/campaign.svg" class="img-fluid" width="300px" alt="Image"></div>
            <?php } ?>
            <div class="bordered locked"><p>Locked (Arcade)</p><img src="img/arcade.svg" class="img-fluid" width="300px" alt="Image"></div>
        </div>
    </section>
    <footer>
        <p><b>Tawaga</b> &copy; 2020</p>
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
            }
            if($sounds == false) {
                echo 'sound = false;';
            }
        ?>
    </script>
</body>

</html>
