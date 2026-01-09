<?php
session_start();

$now=time();

if(!isset($_COOKIE["total_visits"])){
    setcookie("total_visits",1,time()+31536000);
    setcookie("first_visit",$now,time()+31536000);
    $visits=1;
}else{
    $visits=$_COOKIE["total_visits"]+1;
    setcookie("total_visits",$visits,time()+31536000);
}

$history=json_decode($_COOKIE["history"]??"[]",true);
$history[]=$now;
$history=array_slice($history,-5);
setcookie("history",json_encode($history),time()+31536000);

if(!isset($_SESSION["start"])){
    $_SESSION["start"]=$now;
    $_SESSION["pages"]=[];
}

$_SESSION["pages"][]="index.php";

$last=$_COOKIE["last_visit"]??$now;
setcookie("last_visit",$now,time()+31536000);

$last24=0;
foreach($history as $t){
    if($now-$t<=86400)$last24++;
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Home</title>
</head>
<body>

<nav>
<a href="index.php">Home</a> |
<a href="about.php">About</a> |
<a href="services.php">Services</a> |
<a href="contact.php">Contact</a>
</nav>

<h2>Visitor Statistics</h2>

<p>Total Visits: <?php echo $_COOKIE["total_visits"]; ?></p>
<p>First Visit: <?php echo date("Y-m-d H:i:s",$_COOKIE["first_visit"]); ?></p>
<p>Last Visit: <?php echo date("Y-m-d H:i:s",$last); ?></p>
<p>Visits in Last 24 Hours: <?php echo $last24; ?></p>
<p>Session Duration: <?php echo $now-$_SESSION["start"]; ?> seconds</p>

<h3>Pages Visited This Session</h3>
<ul>
<?php
foreach($_SESSION["pages"] as $p){
    echo "<li>$p</li>";
}
?>
</ul>

<h3>Last 5 Visits</h3>
<ul>
<?php
foreach($history as $t){
    echo "<li>".date("Y-m-d H:i:s",$t)."</li>";
}
?>
</ul>

<form method="post" action="clear.php">
<button type="submit">Clear History</button>
</form>

</body>
</html>
