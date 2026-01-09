<?php
$data=json_decode(file_get_contents("php://input"),true);
$ok=$data["name"]&&$data["email"]&&$data["phone"]&&$data["subject"]&&strlen($data["message"])>=20;
header("Content-Type: application/json");
if(!$ok){
echo json_encode(["success"=>false,"message"=>"Validation failed"]);
exit;
}
echo json_encode([
"success"=>true,
"ref"=>uniqid("MSG")
]);
