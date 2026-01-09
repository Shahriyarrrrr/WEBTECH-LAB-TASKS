<?php
$name = "";
$marks = "";
$result = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? "";
    $marks = $_POST["marks"] ?? "";

    if ($marks >= 50) {
        $result = "Pass";
    } else {
        $result = "Fail";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Pass Fail System</title>
</head>
<body>

<form method="post">
    <label>Student Name:</label><br>
    <input type="text" name="name" value="<?php echo $name; ?>"><br><br>

    <label>Marks:</label><br>
    <input type="number" name="marks" value="<?php echo $marks; ?>"><br><br>

    <button type="submit">Submit</button>
</form>

<?php
if ($result !== "") {
    echo "<h3>Name: $name</h3>";
    echo "<h3>Result: $result</h3>";
}
?>

</body>
</html>
