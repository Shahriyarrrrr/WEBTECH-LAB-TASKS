<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $theme = $_POST["theme"] ?? "";
    if ($theme !== "") {
        setcookie("user_theme", $theme, time() + 604800);
        header("Location: read_cookie.php");
        exit;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Set Theme</title>
</head>
<body>

<form method="post">
    <label>Select Theme:</label><br>
    <input type="radio" name="theme" value="Light"> Light
    <input type="radio" name="theme" value="Dark"> Dark<br><br>
    <button type="submit">Save Preference</button>
</form>

</body>
</html>
