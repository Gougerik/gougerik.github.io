<?php
    include('config.php');
    if(!empty($_SESSION['user'])) {
        header('location: index.php');
    }
    $error = '';
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(empty($_POST['email'])) {
            $error = "You didn't enter all required fields!";
        } else {
            $email = stripslashes($_POST['email']);
            if(empty(explode('@',$email)[1])) {
                $error = "Entered value is not in email format!";
            } else {
                $check = mysqli_num_rows(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"));
                if($check == 1) {
                    $id = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM users WHERE email = '$email'"))['id'];
                    header('location: login.php?id='.$id);
                } else {
                    $key = 'abecedazjedladeda';
                    $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
                    $iv = openssl_random_pseudo_bytes($ivlen);
                    $ciphertext_raw = openssl_encrypt($email, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
                    $hmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
                    $ciphertext = base64_encode( $iv.$hmac.$ciphertext_raw );
                    header('location: signup.php?e='.$ciphertext);
                }
            }
        }
    }
    $rf = (!empty($_GET['rf'])) ? $_GET['rf'] : 'index';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Sign In</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <a href="<?php echo $rf; ?>.php">Back</a>
    </header>
    <div id="loader">
        <p>Loading</p>
        <div class="loader"></div>
    </div>
    <section id="home">
        <form action="signin.php" method="POST" autocomplete="on">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" placeholder="@" />
            <button type="submit">Sign In</button>
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