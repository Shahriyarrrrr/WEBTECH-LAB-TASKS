<?php
function sum($a, $b) {
    return $a + $b;
}

echo "<h3>Sum Function:</h3>";
echo sum(5, 10) . "<br>";
echo sum(12, 8) . "<br>";
echo sum(100, 250) . "<br><br>";

function factorial($n) {
    if ($n == 0 || $n == 1) return 1;
    return $n * factorial($n - 1);
}

echo "<h3>Factorial:</h3>";
echo factorial(5) . "<br>";
echo factorial(7) . "<br><br>";

function is_prime($n) {
    if ($n <= 1) return false;
    if ($n == 2) return true;
    for ($i = 2; $i <= sqrt($n); $i++) {
        if ($n % $i == 0) return false;
    }
    return true;
}

echo "<h3>Prime Check:</h3>";
$numbers = [2, 3, 4, 5, 10, 13, 17, 20];

foreach ($numbers as $num) {
    echo $num . (is_prime($num) ? " is prime<br>" : " is NOT prime<br>");
}
?>
