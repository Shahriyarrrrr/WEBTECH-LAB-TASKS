<?php
$file = "students.json";

if (!file_exists($file) || filesize($file) == 0) {
    $students = [];
} else {
    $data = file_get_contents($file);
    $students = json_decode($data, true);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Records</title>
</head>
<body>

<h2>Student List</h2>

<?php
if (empty($students)) {
    echo "No student records found";
} else {
    echo "<table border='1' cellpadding='8'>";
    echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th></tr>";
    foreach ($students as $s) {
        echo "<tr>";
        echo "<td>{$s["id"]}</td>";
        echo "<td>{$s["name"]}</td>";
        echo "<td>{$s["email"]}</td>";
        echo "<td>{$s["department"]}</td>";
        echo "</tr>";
    }
    echo "</table>";
}
?>

<br>
<a href="add_student.php">Add New Student</a>

</body>
</html>
