<?php
echo "<h3>Numbers from 1 to 20 (for loop):</h3>";

for ($i = 1; $i <= 20; $i++) {
    echo $i . " ";
}

echo "<br><br>";
echo "<h3>Even numbers from 1 to 20 (while loop):</h3>";

$n = 1;

while ($n <= 20) {
    if ($n % 2 == 0) {
        echo $n . " ";
    }
    $n++;
}

echo "<br><br>";
$fruits = [
    "apple" => "red",
    "banana" => "yellow",
    "grape" => "purple",
    "orange" => "orange",
    "mango" => "green"
];


echo "<h3>Fruit Names and Their Colors (foreach loop):</h3>";

$count = 0;

foreach ($fruits as $fruit => $color) {
    echo ucfirst($fruit) . " is " . $color . "<br>";
    $count++;

    if ($count == 5) {
        break; 
    }
}
?>
