<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        header('location: index.php');
    }
    $error = '';
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(!empty($_POST['username']) && !empty($_POST['email']) && !empty($_POST['password']) && !empty($_POST['cpassword'])) {
            $username = stripslashes($_POST['username']);
            $username = preg_replace('/[^A-Za-z0-9\-\(\) ]/', '', $username);
            $email = stripslashes($_POST['email']);
            $password = stripslashes($_POST['password']);
            $cpassword = stripslashes($_POST['cpassword']);
            if(empty(explode('@',$email)[1])) {
                $error = "Entered value is not in email format!";
            } else {
                $check = mysqli_num_rows(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"));
                if($check == 1) {
                    $error = "User with the same email is already registered!";
                } else {
                    if(empty($_POST['agree'])) {
                        $error = "You have to agree with Policy Privacy and Terms of Service!";
                    } else {
                        if($password !== $cpassword) {
                            $error = 'Password do not contains!';
                        } else {
                            $pass = hash('sha256',$password);
                            $query = mysqli_query($con, "INSERT INTO users (username,email,password,reg_date) VALUES ('$username','$email','$pass',now())")or die('Insertion error!');
                            $_SESSION['user'] = $username;
                            header('location: index.php');
                        }
                    }
                }
            }
        } else {
            $error = "You didn't enter all required fields!";
        }
    } else {
        if(empty($_GET['e'])) {
            header('location: signin.php');
        } else {
            $key = 'abecedazjedladeda';
            $ciphertext = $_GET['e'];
            $ciphertext = explode(' ',$ciphertext);
            $ciphertext = implode('+',$ciphertext);
            $c = base64_decode($ciphertext);
            $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
            $iv = substr($c, 0, $ivlen);
            $hmac = substr($c, $ivlen, $sha2len=32);
            $ciphertext_raw = substr($c, $ivlen+$sha2len);
            $original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
            $calcmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
            if (hash_equals($hmac, $calcmac))
            {
                $email = $original_plaintext;
            } else {
                header('location: signin.php');
            }
        }
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Sign Up</title>
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
        <form action="signup.php" method="POST" autocomplete="off">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" value="<?php echo (!empty($_POST['username'])) ? $_POST['username'] : ''; ?>" />
            <label for="email">Email</label>
            <input type="email" name="email" id="email" value="<?php echo $email; ?>" readonly />
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
            <label for="cpassword">Confirm Password</label>
            <input type="password" name="cpassword" id="cpassword" />
            <button type="submit">Sign Up</button>
            <div><input type="checkbox" name="agree" id="agree" style="width: unset;"> <label for="agree">I agree with <a href="privacy.html" target="_blank">Privacy Policy</a> & <a href="terms.html" target="_blank">Terms of Service</a>.</label></div>
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
    </script>
</body>
</html>