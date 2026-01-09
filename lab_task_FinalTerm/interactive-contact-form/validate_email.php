<?php
$email=$_GET["email"]??"";
$used=["test@example.com","admin@example.com"];
$valid=filter_var($email,FILTER_VALIDATE_EMAIL)&&!in_array($email,$used);
header("Content-Type: application/json");
echo json_encode([
"valid"=>$valid,
"message"=>$valid?"":"Email invalid or already exists"
]);
