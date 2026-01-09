<?php
require "db_connect.php";

$result = mysqli_query($conn, "SELECT * FROM students");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Records</title>
</head>
<body>

<h2>Student Records</h2>

<?php
if (mysqli_num_rows($result) > 0) {
    echo "<table border='1' cellpadding='8'>";
    echo "<tr>
            <th>ID</th>
            <th>Name</th>
            <th>Registration No</th>
            <th>Program</th>
          </tr>";

    while ($row = mysqli_fetch_assoc($result)) {
        echo "<tr>";
        echo "<td>{$row["id"]}</td>";
        echo "<td>{$row["name"]}</td>";
        echo "<td>{$row["registration_no"]}</td>";
        echo "<td>{$row["program"]}</td>";
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "No student records found.";
}

mysqli_close($conn);
?>

</body>
</html>
