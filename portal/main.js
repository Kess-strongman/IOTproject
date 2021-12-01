var apikey = "cb6d166ce74eaa13d1d2bcd086fefedb"

var timeinterval, bulbinterval;
var MYURL = "http://unn-w18011712.newnumyspace.co.uk/IOTproject/portal/";

// when page loads
$(document).ready(function() {
  timeinterval = setInterval(displaytime, 1000);
   //bulbinterval = setInterval(ingestBulb, 10000)
    getLocation();
});//window event listener end

function displaytime() {
  var now = new Date();
  $("#time").text(now.getHours() + ":" + now.getMinutes()+ ":" + now.getSeconds());
  
}

function getLocation() {
  if (navigator.geolocation) {
      console.log("Getting geolaction")
    navigator.geolocation.getCurrentPosition(showPosition);
    
  } else {
      console.log("error")
    $("#location").text("Geolocation is not supported by this browser.");
  }
}

function togglePower(status) {
  let ajaxurl = 'bulb.php',
  data =  {'status': status};
  $.post(ajaxurl, data, function (response) {
    console.log("Set status: " + status);
    console.log(response);
  });
  }

function showPosition(position) {
  
//     $("#location").text("Latitude: " + position.coords.latitude +
//   "<br>Longitude: " + position.coords.longitude);
  GetTown(position.coords.latitude, position.coords.longitude)
}

function GetTown(lat, lon) {

    $.get("https://api.openweathermap.org/data/2.5/find?lat="+lat+"&lon="+lon+"&cnt=1&appid=" + apikey, function(data, status) {
   console.log(data, status)
   GetWeather(data.list[0].name)
   $("#location").text(data.list[0].name)
}).fail(function() {
   console.log("api failed")
});
    
}

function GetWeather(town) {

$.get("https://api.openweathermap.org/data/2.5/weather?q="+town+"&units=metric&appid=" + apikey, function(data, status) {
   console.log(data, status)
    $("#weatherdesc").text(data.weather[0].description);
    $("#cloudcoverage").text(data.clouds.all+"%");
    Setweathericon(data.clouds.all)
    var sunrise = new Date(data.sys.sunrise*1000)
    console.log(sunrise)
    $("#sunrise").html("Sunrise <br>" + sunrise.getHours() + ":" +sunrise.getMinutes())
    var sunset = new Date(data.sys.sunset*1000)
    $("#sunset").html("Sunset <br>" + sunset.getHours() + ":" +sunset.getMinutes())
}).fail(function() {
   console.log("api failed")
});
}

function Setweathericon(percent) {
 
  console.log("seeing icon " +  percent)
  if (percent <= 25) {
    $("#weatherimg").attr("src","weathericons/sun.jpg")
  } else if (percent > 25 & percent <= 50) {
    $("#weatherimg").attr("src","weathericons/partialcloud.jpg")
  }else if (percent > 50 & percent <= 75) {
    console.log("cloud")
    $("#weatherimg").attr("src","weathericons/brokenclouds.jpg")
  }else if (percent > 75 & percent <= 100) {
    $("#weatherimg").attr("src","weathericons/cloud.jpg")
  }
}
function SunSetProtocol() {
//needs to be triggered an hour before sunset
//need to check if the light is already on.
//needs to cope if the light is turned on during that hour

//every 5 minutes need to change the light? or is that too jarring.
//might be best to change at tiny increments over the hour every minute
}
