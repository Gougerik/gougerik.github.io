<?php
    session_start();
    $_SESSION['empty'] = 'ua';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tawaga - Level Builder</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .block:hover {
            background-image: url('wall.svg') !important;
            filter: brightness(2);
        }   
        .wall {
            position: relative;
        }
        .wall::after {
            content: " ";
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: red;
            opacity: 0.5;
            display: none;
        }
        .wall:hover {
            filter: none;
        }
        .wall:hover::after {
            display: unset;
        }
    </style>
</head>

<body>
    <header>
        <a href="index.php">Home</a>
    </header>
    <nav>
        <p class="beta">Level Builder</p>
    </nav>
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
            <input type="number" name="goal" placeholder="Goal" required />
            <button id="initBtn">Apply</button>
        </legend>
        <legend style="align-items: flex-end;align-self: flex-end;">
            <button id="generateBtn">Generate code</button>
        </legend>
        <div id="canvas">
            <p class="middle text-center">Set default parameters.</p>
        </div>
    </section>
    <footer>
        <p><b>Tips: </b>You can place walls by clicking on fields in the canvas.</p>
    </footer>
    <div class="modal" id="jsonModal">
        <form action="loadcode.php" style="width: 100%;" method="post" autocomplete="off">
        <div class="modal-body">
            <textarea name="code" id="initJson" style="width: 100%;" rows="20" readonly>Something is wrong.</textarea>
            <div style="display: flex; flex-direction: row;">
                <button onclick="ctc('#initJson');" type="button">Copy</button>
                &nbsp;
                <button type="submit">Load</button>
                &nbsp;
                <button onclick="document.getElementById('jsonModal').style.display = 'none';" type="button">Close</button>
            </div>
        </div>
        </form>
    </div>
    <div class="modal" id="ctcModal">
        <div class="modal-body text-center">
            <p class="init">Copied to clipboard.</p>
            <br>
            <button onclick="document.getElementById('ctcModal').style.display = 'none';">OK</button>
        </div>
    </div>
    <!-- SCRIPTS IMPORT -->
    <script src="jquery.min.js"></script>
    <script src="levelbuilder.js"></script>
    <script>
        bombs = true;
    </script>
</body>

</html>
