<?php
$temperature = 18; 
$day = 3; 

if (!is_numeric($temperature)) {
    die("Error: Temperature must be a numeric value.<br>");
}

if (!is_numeric($day) || $day < 1 || $day > 7) {
    die("Error: Day must be a number between 1 and 7.<br>");
}

echo "Temperature: $temperature °C<br>";

if ($temperature < 10) {
    echo "It's cold.<br><br>";
} elseif ($temperature >= 10 && $temperature <= 25) {
    echo "It's warm.<br><br>";
} else {
    echo "It's hot.<br><br>";
}

echo "Day Number: $day<br>";

switch ($day) {
    case 1:
        echo "Monday";
        break;
    case 2:
        echo "Tuesday";
        break;
    case 3:
        echo "Wednesday";
        break;
    case 4:
        echo "Thursday";
        break;
    case 5:
        echo "Friday";
        break;
    case 6:
        echo "Saturday";
        break;
    case 7:
        echo "Sunday";
        break;
    default:
        echo "Invalid day.";
}
?>
