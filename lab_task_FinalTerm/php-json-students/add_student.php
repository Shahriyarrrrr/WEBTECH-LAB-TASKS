<?php
$file = "students.json";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $student = [
        "id" => $_POST["id"],
        "name" => $_POST["name"],
        "email" => $_POST["email"],
        "department" => $_POST["department"]
    ];

    if (file_exists($file) && filesize($file) > 0) {
        $data = json_decode(file_get_contents($file), true);
    } else {
        $data = [];
    }

    $data[] = $student;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
</head>
<body>

<h2>Add Student</h2>

<form method="post">
    <label>ID:</label><br>
    <input type="text" name="id"><br><br>

    <label>Name:</label><br>
    <input type="text" name="name"><br><br>

    <label>Email:</label><br>
    <input type="email" name="email"><br><br>

    <label>Department:</label><br>
    <input type="text" name="department"><br><br>

    <button type="submit">Add</button>
</form>

</body>
</html>
