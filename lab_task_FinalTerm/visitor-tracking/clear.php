<?php
session_start();
session_destroy();

setcookie("total_visits","",time()-3600);
setcookie("first_visit","",time()-3600);
setcookie("last_visit","",time()-3600);
setcookie("history","",time()-3600);

header("Location: index.php");
exit;
