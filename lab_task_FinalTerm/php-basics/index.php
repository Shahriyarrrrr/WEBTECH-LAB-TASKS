<?php
$name = "Shahriyar Simoon";
$studentId = "22-XXXX-1";
$department = "Computer Science & Engineering";

echo "<h2>Student Information</h2>";
echo "Name: $name<br>";
echo "Student ID: $studentId<br>";
echo "Department: $department<br><br>";

$a = 20;
$b = 6;

echo "<h2>Arithmetic Operations</h2>";
echo "Addition: " . ($a + $b) . "<br>";
echo "Subtraction: " . ($a - $b) . "<br>";
echo "Multiplication: " . ($a * $b) . "<br>";
echo "Division: " . ($a / $b) . "<br><br>";

$stringNumber = "45";
$floatNumber = 12.7;

echo "<h2>Type Casting</h2>";
echo "String to Integer: " . (int)$stringNumber . "<br>";
echo "Float to Integer: " . (int)$floatNumber . "<br><br>";

$marks = 72;

echo "<h2>Grade Result</h2>";
if ($marks >= 80) {
    echo "Grade A";
} elseif ($marks >= 65) {
    echo "Grade B";
} elseif ($marks >= 50) {
    echo "Grade C";
} else {
    echo "Fail";
}

echo "<br><br>";

echo "<h2>For Loop (1 to 10)</h2>";
for ($i = 1; $i <= 10; $i++) {
    echo $i . " ";
}

echo "<br><br>";

echo "<h2>While Loop (Even numbers 1 to 20)</h2>";
$i = 2;
while ($i <= 20) {
    echo $i . " ";
    $i += 2;
}

echo "<br><br>";

$languages = ["PHP", "JavaScript", "C#", "Python", "Java"];

$profile = [
    "Name" => "Shahriyar",
    "Email" => "example@email.com",
    "City" => "Dhaka"
];

echo "<h2>Favorite Programming Languages</h2>";
foreach ($languages as $lang) {
    echo $lang . "<br>";
}

echo "<br>";

echo "<h2>Profile Information</h2>";
foreach ($profile as $key => $value) {
    echo $key . ": " . $value . "<br>";
}

echo "<br>";

function calculateSquare($number) {
    return $number * $number;
}

echo "<h2>Function Output</h2>";
echo "Square of 7 is: " . calculateSquare(7);
?>
