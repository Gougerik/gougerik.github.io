<?php
    include('../config.php');
    if(empty($_SESSION['user'])) {
        header('location: ../index.php');
    }
    $user = $_SESSION['user'];
    $query = mysqli_query($con, "SELECT * FROM users WHERE username = '$user  '");
    $row = mysqli_fetch_array($query);
    $id = $row['id'];
    $credits = number_format((float)(intval($row['credits'])/1000), 2, '.', '');
    $level = $row['level'];
    $character = $row['character'];
    if(!empty($_GET['buy'])) {
        $val = $_GET['buy'];
        if(intval($row['credits']) > intval(($val*10000)-10000)) {
            $newbal = intval($row['credits'])-intval(($val*10000)-10000);
            $buy = mysqli_query($con, "UPDATE users SET credits = '$newbal', `character` = '$val' WHERE username = '$user'");
            header('location: store.php');
        } else {
            echo "<script>alert('You have no enough credits!');</script>";
        }
    }

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Store</title>
    <link rel="stylesheet" href="../style.css">
</head>

<body>
    <header>
        <a href="index.php?id=<?php echo $id; ?>">Back</a>
    </header>
    <nav>
    <?php if(!empty($_SESSION['user'])) { ?><p>Balance: <span class="init" id="balance"><?php echo (!empty($_SESSION['user'])) ? $credits : '0'; ?>k</span> <span class="init">Credits</span></p><?php } ?>
    </nav>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
    <h2>Store</h2><br>
    <div class="flex-wrapper" style="flex-wrap: wrap; margin: 0 4rem;">
        <?php $i = 1; while($i <= 12) { if($level >= $i) { if($i == $character) { ?>
            <div style="flex: 1 0 21%; " class="bordered"><p>Equiped</p><img src="../characters/dn<?php echo $i; ?>.svg" width="40%" alt="Character"></div>
        <?php } else { ?>
            <a style="flex: 1 0 21%; " href="store.php?buy=<?php echo $i; ?>" class="bordered"><img src="../characters/dn<?php echo $i; ?>.svg" width="40%" alt="Character"><p><?php echo (10000*$i)-10000; ?> $</p></a>
        <?php }} else { ?>
            <div style="flex: 1 0 21%; " class="bordered locked"><p>Locked</p><img src="../characters/dn<?php echo $i; ?>.svg" width="40%" alt="Character"></div>
        <?php } $i += 1; } ?>
    </div>
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