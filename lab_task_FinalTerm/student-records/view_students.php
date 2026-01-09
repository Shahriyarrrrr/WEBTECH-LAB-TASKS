<?php
require "db_connect.php";

$sql = "SELECT id, name, email, age, department FROM students";
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Students</title>
</head>
<body>

<h2>Student Records</h2>

<?php
if (mysqli_num_rows($result) > 0) {
    echo "<table border='1' cellpadding='8'>";
    echo "<tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Department</th>
          </tr>";

    while ($row = mysqli_fetch_assoc($result)) {
        echo "<tr>";
        echo "<td>{$row["id"]}</td>";
        echo "<td>{$row["name"]}</td>";
        echo "<td>{$row["email"]}</td>";
        echo "<td>{$row["age"]}</td>";
        echo "<td>{$row["department"]}</td>";
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "No student records found.";
}

mysqli_free_result($result);
mysqli_close($conn);
?>

</body>
</html>
