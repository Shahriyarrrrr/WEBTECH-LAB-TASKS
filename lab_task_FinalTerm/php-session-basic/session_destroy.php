<?php
session_start();
session_unset();
session_destroy();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Session Destroy</title>
</head>
<body>

<h2>Session Ended Successfully</h2>
<a href="session_start.php">Start New Session</a>

</body>
</html>
