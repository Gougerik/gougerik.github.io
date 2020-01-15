<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        header('location: index.php');
    }
    $error = '';
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(!empty($_POST['email']) || !empty($_POST['password'])) {
            $email = stripslashes($_POST['email']);
            $password = stripslashes($_POST['password']);
            if(empty(explode('@',$email)[1])) {
                $error = "Entered value is not in email format!";
            } else {
                $check = mysqli_num_rows(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"));
                if($check == 0) {
                    $error = "User with this email adress does not exists!";
                } else {
                    $cpass = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"))['password'];
                    $pass = hash('sha256',$password);
                    if($pass !== stripslashes($cpass)) {
                        $error = "You entered wrong password!";
                    } else {
                        $username = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"))['username'];
                        $_SESSION['user'] = $username;
                        if(!empty($_POST['remember'])) {
                            unset($_COOKIE['username']);
                            unset($_COOKIE['password']);
                            setcookie('username', $username, time()+60*60*24*365);
                            setcookie('password', $pass, time()+60*60*24*365);
                        } else {
                            unset($_COOKIE['username']);
                            unset($_COOKIE['password']);
                            setcookie('username', $username, false);
                            setcookie('password', $pass, false);
                        }
                        header('location: index.php');
                    }
                }
            }
        } else {
            $error = "You didn't enter all required fields!";
        }
    } else {
        if(empty($_GET['id'])) {
            header('location: signin.php');
        }
        $id = $_GET['id'];
        $email = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE id = '$id'"))['email'];
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Login In</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <a href="signin.php">Back</a>
    </header>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <form action="login.php" method="POST" autocomplete="on">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" value="<?php echo $email; ?>" readonly />
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
            <button type="submit">Log In</button>
            <div>
                <input type="checkbox" name="remember" id="remember" onchange="Switch('remember');" hidden />
                <div style="display: inline-block;">
                    <div class="ccb-wrapper" onclick="$('#remember').click();">
                        <div class="jockey toggle-off" id="toggle-remember"></div>
                    </div>
                </div>
                <label for="remember"> Stay logged in</label>
            </div>
            <div><span class="init"><?php echo '<br/>'.$error; ?></span></div>
        </form>
    </section>
    <!-- SCRIPTS IMPORT -->
    <script src="jquery.min.js"></script>    
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