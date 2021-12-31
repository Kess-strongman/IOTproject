var apikey = "cb6d166ce74eaa13d1d2bcd086fefedb"

var timeinterval, bulbinterval, checktime;
var MYURL = "http://unn-w18011712.newnumyspace.co.uk/IOTproject/portal/";
var sunset = new Date();
//settings.bedtime;
// when page loads
$(document).ready(function() {
  timeinterval = setInterval(displaytime, 1000);
  //$("#bulbs").change(alert("changed"))//getBulb($("#bulbs option:selected").val()))
   //bulbinterval = setInterval(ingestBulb, 10000)
  $(".hideable").hide();
  $("#login").show();

  checktime = setInterval(InitiateProtocols, 5000)
});//window event listener end

function showHome() {
  $(".hideable").hide();
  $("#home").show();
  getLocation();
  PopulateBulbSelect();
  ShowOccupancy();
 
      //getBulb($("#bulbs").val());
}

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
  let ajaxurl = 'bulb.php';
  data =  {'status': status};
  $.post(ajaxurl, data, function (response) {
    console.log("Set status: " + status);
    console.log(response);
  });
  getBulb();
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
    sunset = new Date(data.sys.sunset*1000)
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

function getBulb() {
  var id = $("#bulbs option:selected").val()
  console.log("get bulb "+ id)
  let ajaxurl = 'stats.php';
  $.post(ajaxurl, '', function(response) {
    var obj = JSON.parse(response)
    for (let bulb of obj) {
      console.log( bulb );
      if (bulb.id == id) {
        console.log(bulb.color)
        $("#bulb_id").val(bulb.id)
        $("#hue").val(bulb.color.hue);
        $("#saturation").val(bulb.color.saturation);
        $("#kelvin").val(bulb.color.kelvin);
        $("#brightness").val(bulb.brightness)
        console.log(bulb.power)
        if (bulb.power == "on") {
          $("#buttOn").attr('disabled',true);
          $("#buttOff").attr('disabled',false);
        } else {
          $("#buttOn").attr('disabled',false);
          $("#buttOff").attr('disabled',true);
        }
      }
    }
  });
}

function PopulateBulbSelect(){ 
  console.log("poplate select")
  $("#bulbs").empty();
  $("#bulbs").append('<option value="" selected>Choose bulb</option>');
  let ajaxurl = 'stats.php';
  $.post(ajaxurl, '', function(response) {
    var obj = JSON.parse(response)
  for (let bulb of bulbData.bulbs) {
    let found = false;
      
      console.log("bulbdata", bulb)
    for (let item of obj) {
      console.log("select item", item)
      
      if (bulb.id == item.id) {
        found = true
        $("#bulbs").append('<option id="op_'+bulb.name+'" value="'+bulb.id+'" >'+bulb.name+'</option>');
        $("#activedevices").append('<input type="text" id="dev_'+bulb.id+'" disabled >');
        $("#dev_"+bulb.id).val(bulb.name + " " + item.id + " " )
      }
        
    }
    if (found == false) {
      $("#inactivedevices").append('<input type="text" id="dev_'+bulb.id+'" disabled >');
      $("#dev_"+bulb.id).val(bulb.name + ": " + bulb.id + " " )
    }
  }
});
}

function ShowOccupancy() {
  let percent = Math.round((occupany.truths/occupany.readings)*100)
  $("#occuppercent").text(percent+"%")
}
function GetLightIntensity() {
 console.log("getting lifht intensity")
  $.ajax({
    url:"http://192.168.0.14:5000/",
    type:'GET',
    Accept: "text/html",
Cookie: "Version=1",
origin:"*",
    success: function(data){
      console.log(data)
        var latestreading = data
        console.log("W0rking! intentity: ", latestreading)
        ShowLight(latestreading)
    },
     error: function(xhr, ajaxOptions, thrownError) {
      console.log("error")
     // alert(xhr.status + " Issue resetting password: "+ xhr.responseText);
      ShowLight(1.0)
  }
 });
}
function ShowLight(intensity) {
// intensity is 0.0-3.3
  var brightness = intensity / 3.3

  $("#lightindex").text(Math.round((1-brightness)*100)+"%")
  CalculateEnergy(Math.round((brightness)*100)/100)
  
 //check colour
 var newstatsstruct = {}
 newstatsstruct.brightness = brightness
let ajaxurl = 'stats.php';
$.post(ajaxurl, '', function(response) {
  var obj = JSON.parse(response)
  for (let bulb of obj) {
    console.log( bulb );
    if (bulb.power == "on") {
      console.log("bulbkelvin"+bulb.color.kelvin)
      newstatsstruct.kelvin = bulb.color.kelvin
      UpdateStats(newstatsstruct, bulb.id)
    }
  }
});
}
function CalculateEnergy(brightness) {
  console.log(brightness)
var power = Math.round((brightness * 40)*100)/100
console.log(power)
var kwh = Math.round(((power/1000)*1)*1000)/1000

$("#currentenergy").text(kwh+"kwh")
}
function AddDevice() {
  $("#inactivedevices").append('<input type="text" id="dev_'+$("#newdevid").val()+'" disabled >');
  $("#dev_"+$("#newdevid").val()).val($("#newdevname").val()+ ": " + $("#newdevid").val() + " " )
  $("#newdevid").val("")
  $("#newdevname").val("")
}
function InitiateProtocols() {
  console.log("inititing protocols")
  var bedtime = temp_bedtime
  var sunset = temp_sunset
  var currenttime = new Date();
  console.log("current time: "+currenttime)
  //console.log(bedtime.getHours() + " "+ (bedtime.getHours()-1))
  var sixtyToBedtime = new Date(bedtime);
  sixtyToBedtime.setHours(sixtyToBedtime.getHours() -1)
  //console.log("bedtime:"+bedtime+" sixtybefore:"+new Date(sixtyToBedtime))

  var sixtyAftSunset = new Date(sunset)
  sixtyAftSunset.setHours(sixtyAftSunset.getHours() + 1)
  //console.log("sunset:"+sunset+" sixtyafter:"+sixtyAftSunset)

  if (currenttime > sunset && currenttime < sixtyAftSunset) { 
    console.log("within sunset hours")
    if (currenttime > sixtyToBedtime && currenttime < bedtime) {
      console.log("within bedtime hours")
      minutestillsleep = ((bedtime.getTime() - currenttime.getTime())/1000)/60
      bedtimeProtocol(minutestillsleep)
    } else {
      minsaftersunset = ((currenttime.getTime() - sunset.getTime()) /1000) / 60
      console.log("mins after sunset ", minsaftersunset)
      SunSetProtocol(minsaftersunset)
    }
  } else if (currenttime > sixtyToBedtime && currenttime < bedtime) {
    minutestillsleep = ((bedtime.getTime() - currenttime.getTime())/1000)/60
    bedtimeProtocol(minutestillsleep)
  } else {
    console.log("no protocols initiated")
  GetLightIntensity()
  }
}
function checkPower(newstatsstruct) {
  let ajaxurl = 'stats.php';
  $.post(ajaxurl, '', function(response) {
    var obj = JSON.parse(response)
    for (let bulb of obj) {
      console.log( bulb );
      if (bulb.power == "on") {
        UpdateStats(newstatsstruct, bulb.id)
      }
    }
  });
}
function SunSetProtocol(minsaftersunset) {
  console.log("sunset protocol initiated")
  var newstatsstruct = {}
  newstatsstruct.time = "sunset"
//needs to be triggered an hour before sunset
//at sunset. brightness = 1, kelvin = 1500
 if (minsaftersunset <= 60 && minsaftersunset > 0) {

  percentagetime = Math.round((minsaftersunset/60)*100)/100
  console.log(percentagetime)
  newstatsstruct.hue = Math.round(360*percentagetime)
  newstatsstruct.saturation = 1
  newstatsstruct.kelvin = Math.round(2700 + (5000*percentagetime))
  newstatsstruct.brightness = Math.round(percentagetime*100)/100
  checkPower(newstatsstruct)
 }
 
}

function bedtimeProtocol(minutestillsleep) {
  var newstatsstruct = {}
  newstatsstruct.time = "bedtime"
  console.log("bedtime protocol " + minutestillsleep)
    if (minutestillsleep <= 60 && minutestillsleep > 0) {
      percentagetime = Math.round((minutestillsleep/60)*100)/100
      newstatsstruct.kelvin = Math.round(1500 + (5500*percentagetime))
      newstatsstruct.brightness = Math.round((0.2+(minutestillsleep/100))*100)/100
      checkPower(newstatsstruct)
    }
  
}


function UpdateStats(stats,id ) {

  console.log(id + " update stats called - ", stats)
  let ajaxurl = 'updatestats.php';
  data =  {'stats': {'id':id,'brightness': stats.brightness, 'kelvin': stats.kelvin}};
  $.post(ajaxurl, data, function (response) {
   // console.log("Set stats: " + stats);
    console.log(response);
  });  
  getBulb()
}