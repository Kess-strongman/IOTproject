<?php

   powerToggle($_POST['status']);

$authToken = "c081387548f098b18c10847dfe193371c438c481334b6d41989e45965c56ad12";
 
 function powerToggle($status) {
  $link = "https://api.lifx.com/v1/lights/all/state";
  
  $headers = array('Authorization: Bearer ' . "c081387548f098b18c10847dfe193371c438c481334b6d41989e45965c56ad12");
  
  $data = 'power=' . $status;
  
  $ch = curl_init($link);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  $response = curl_exec($ch);
 }





// $method = $_SERVER['REQUEST_METHOD'];
// $uri = $_SERVER['REQUEST_URI'];
// $protocol = $_SERVER['SERVER_PROTOCOL'];
// $headers = getallheaders();

// //echo "$method $uri $protocol <br/>";
// foreach ($headers as $key => $header) {

//     if ($key == "wf_tkn") {
//         echo "$key: $header <br/>";
//         echo "all good dawg";
//     }

// }

// class Bulb {
//     // Properties
//     public $name;
//     public $hue;
//     public $brightness;
  
//     // Methods
//     function set_name($name) {
//         $this->name = $name;
//       }
//     function set_hue($hue) {
//       $this->hue = $hue;
//     }
//     function get_hue() {
//       return $this->hue;
//     }
//   }
  
// $NAME = $_GET['name'];
// // Sanitizes input thoroughly.
// $bulb1 = new Bulb();
// $bulb1->name = $NAME;
// $bulb1->set_hue('1.5');
// $bulb1->city = "New York";

// $myJSON = json_encode($bulb1);

// echo $myJSON;

?>