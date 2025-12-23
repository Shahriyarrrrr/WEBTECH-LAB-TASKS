<?php
$stringVar = "Hello, PHP!";
$intVar = 20;
$floatVar = 5.75;
$boolVar = true;

$addition = $intVar + $floatVar;
$subtraction = $intVar - $floatVar;
$multiplication = $intVar * $floatVar;
$division = $intVar / $floatVar;

echo "Addition Result: " . $addition . "<br>";
echo "Subtraction Result: " . $subtraction . "<br>";
echo "Multiplication Result: " . $multiplication . "<br>";
echo "Division Result: " . $division . "<br><br>";

$num1 = 15;
$num2 = 25;
$sum = $num1 + $num2;

echo "Sum using echo: " . $sum . "<br>";
print "Sum using print: " . $sum . "<br><br>";

echo "<h3>Variable Types and Values:</h3>";
var_dump($stringVar); echo "<br>";
var_dump($intVar); echo "<br>";
var_dump($floatVar); echo "<br>";
var_dump($boolVar); echo "<br>";
?>
