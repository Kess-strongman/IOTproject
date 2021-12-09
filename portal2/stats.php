<?php 
Statcheck();
function Statcheck() {
  
  $link = "https://api.lifx.com/v1/lights/all";
  

$ch = curl_init($link);
$headers = array('Authorization: Bearer ' . "c081387548f098b18c10847dfe193371c438c481334b6d41989e45965c56ad12");
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);

}

?>

