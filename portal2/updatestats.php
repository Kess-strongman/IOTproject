<?php
Updatestats($_POST['stats']);

 
 function Updatestats($stats) {
  $link = "https://api.lifx.com/v1/lights/all/state";
  
  $headers = array('Authorization: Bearer ' . "c081387548f098b18c10847dfe193371c438c481334b6d41989e45965c56ad12");
  
  $data = 'brightness='.$stats;//' . $stats;
  
  $ch = curl_init($link);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  $response = curl_exec($ch);
 }

?>