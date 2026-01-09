<?php
$student = [
    "Name" => "Shahriyar Simoon",
    "ID" => "22-XXXX-1",
    "Department" => "CSE",
    "Email" => "example@email.com"
];

$jsonStudent = json_encode($student);

$decodedStudent = json_decode($jsonStudent, true);

$students = [
    [
        "Name" => "John Doe",
        "ID" => "1",
        "Courses" => ["Programming", "Calculus", "Physics"]
    ],
    [
        "Name" => "Alice Smith",
        "ID" => "2",
        "Courses" => ["Data Structures", "Algorithms", "Statistics"]
    ],
    [
        "Name" => "Bob Khan",
        "ID" => "3",
        "Courses" => ["English", "Economics", "Management"]
    ]
];

$jsonStudents = json_encode($students);

$decodedStudents = json_decode($jsonStudents, true);
?>

<!DOCTYPE html>
<html>
<head>
    <title>JSON in PHP</title>
</head>
<body>

<h2>Part A: PHP Array to JSON</h2>
<?php
echo $jsonStudent;
?>

<h2>Part B: JSON to PHP Array</h2>
<ul>
<?php
foreach ($decodedStudent as $k => $v) {
    echo "<li>$k: $v</li>";
}
?>
</ul>

<h2>Part C: Nested JSON</h2>
<?php
echo $jsonStudents;
?>

<table border="1" cellpadding="8">
<tr>
    <th>Name</th>
    <th>ID</th>
    <th>Courses</th>
</tr>
<?php
foreach ($decodedStudents as $s) {
    echo "<tr>";
    echo "<td>{$s["Name"]}</td>";
    echo "<td>{$s["ID"]}</td>";
    echo "<td>" . implode(", ", $s["Courses"]) . "</td>";
    echo "</tr>";
}
?>
</table>

</body>
</html>
