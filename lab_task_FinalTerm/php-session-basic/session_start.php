<?php
session_start();

if (!isset($_SESSION["username"])) {
    $_SESSION["username"] = "Student";
    $_SESSION["visits"] = 0;
}

$_SESSION["visits"]++;
?>

<!DOCTYPE html>
<html>
<head>
    <title>Session Start</title>
</head>
<body>

<h2>Welcome <?php echo $_SESSION["username"]; ?></h2>
<p>Number of visits: <?php echo $_SESSION["visits"]; ?></p>

<a href="session_destroy.php">End Session</a>

</body>
</html>
