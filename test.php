<?php

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$protocol = $_SERVER['SERVER_PROTOCOL'];
$headers = getallheaders();

//echo "$method $uri $protocol <br/>";
foreach ($headers as $key => $header) {

    if ($key == "wf_tkn") {
        echo "$key: $header <br/>";
        echo "all good dawg";
    }

}
echo 'Hello ' . htmlspecialchars($_GET["name"]) . '!\n';
echo "you used the token" . htmlspecialchars($_GET["tkn"]);
$NAME = $_GET['name'];
// Bad:
echo "\n".$NAME;
// that one is vulnerable to XSS
// Good:
echo "\n".htmlspecialchars($NAME);
// Sanitizes input thoroughly.
$myObj->name = $NAME;
$myObj->age = 30;
$myObj->city = "New York";

$myJSON = json_encode($myObj);

echo "\n".$myJSON;
?>