<!DOCTYPE html>
<html>
<head>
    <title>Read Cookie</title>
</head>
<body>

<?php
if (isset($_COOKIE["user_theme"])) {
    echo "Hello! Your preferred theme is " . $_COOKIE["user_theme"] . ".";
} else {
    echo "No theme selected. Please choose your preferred theme.";
}
?>

<br><br>
<a href="delete_cookie.php">Delete Theme Preference</a>

</body>
</html>
