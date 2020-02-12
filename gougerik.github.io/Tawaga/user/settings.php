
<?php
    include('../config.php');
    if(empty($_SESSION['user'])) {
        header('location: ../index.php');
    }
    $error = '';
    $user = $_SESSION['user'];
    $query = mysqli_query($con, "SELECT * FROM users WHERE username = '$user'");
    $row = mysqli_fetch_array($query);
    $id = $row['id'];
    $sounds = $row['sounds_fx'];
    $email = $row['email'];
    $email = preg_replace_callback('/(\w)(.*?)(\w)(@.*?)$/s', function ($matches){
        return $matches[1].preg_replace("/\w/", "*", $matches[2]).$matches[3].$matches[4];
    }, $email);
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $sounds = (!empty($_POST['sounds'])) ? 'true' : 'false';
        if (!empty($_POST['oldpassword']) || !empty($_POST['newpassword']) || !empty($_POST['cnewpassword'])) {
            if (!empty($_POST['oldpassword']) && !empty($_POST['newpassword']) && !empty($_POST['cnewpassword'])) {
                $pass = stripslashes(hash('sha256',$_POST['oldpassword']));
                $check = mysqli_num_rows(mysqli_query($con, "SELECT * FROM users WHERE password = '$pass' AND username = '$user'"));
                if($check == 1) {
                    if(stripslashes($_POST['newpassword']) == stripslashes($_POST['cnewpassword'])) {
                        $password = stripslashes(hash('sha256',$_POST['newpassword']));
                        $query = mysqli_query($con, "UPDATE users SET password = '$password' WHERE username = '$user'");
                        header('location: settings.php');
                    } else {
                        $error = 'New passwords do not contains!';
                    }
                } else {
                    $error = "You entered wrong old password!";
                }
            } else {
                $error = 'If you want to change your password you need to fill all password fields.';
            }
        } elseif(!empty($_POST['username'])) {
            $username = stripslashes($_POST['username']);
            $username = preg_replace('/[^A-Za-z0-9\-\(\) ]/', '', $username);
            $query = mysqli_query($con, "UPDATE users SET username = '$username' WHERE username = '$user'");
            $_SESSION['user'] = $username;
            header('location: settings.php');
        } 
        $query = mysqli_query($con, "UPDATE users SET sounds_fx = ".$sounds." WHERE username = '$user'");
    }   
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Settings</title>
    <link rel="stylesheet" href="../style.css">
</head>

<body>
    <header>
        <a href="index.php?id=<?php echo $id; ?>">Back</a>
    </header>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <h2 class="init"><?php echo $user; ?></h2><br/>
        <form action="settings.php" method="post" autocomplete="off">
            <label for="email">Email: *</label>
            <input type="email" id="email" value="<?php echo $email; ?>" readonly />
            <label for="username">Username: </label>
            <input type="text" name="username" id="username" value="<?php echo $user; ?>" />
            <label for="oldpassword">Old Password:</label>
            <input type="password" name="oldpassword" id="oldpassword" placeholder="********" />
            <label for="newpassword">New Password: </label>
            <input type="password" name="newpassword" id="newpassword" />
            <label for="cnewpassword">Confirm new Password: </label>
            <input type="password" name="cnewpassword" id="cnewpassword" />
            <div>
                <label for="sounds">Sounds FX: </label>
                <input type="checkbox" name="sounds" id="sounds" onchange="Switch('sounds');" <?php echo ($sounds == true) ? 'checked' : ''; ?> hidden />
                <div style="display: inline-block;">
                    <div class="ccb-wrapper" onclick="$('#sounds').click();">
                        <div class="jockey toggle-<?php echo ($sounds == true) ? 'on' : 'off'; ?>" id="toggle-sounds"></div>
                    </div>
                </div>
            </div>
            <button type="submit">Update settings</button>
            <div><span class="init"><?php echo '<br/>'.$error; ?></span></div>
        </form>
    </section>
    <!-- SCRIPTS IMPORT -->
    <script src="../jquery.min.js"></script>    
    <script>
        $(document).ready(function () {
            $('#loader').css('display','none');
            $('#home').css('display','flex');
        });
        Switch = (id) => {
            if (!$('#'+id).is(':checked')) {
                $('#toggle-'+id).attr('class','jockey toggle-off');
            } else {
                $('#toggle-'+id).attr('class','jockey toggle-on');
            }
        }
    </script>
</body>
</html>
