function ingestBulb() {
    
    $.ajax({
        type: 'POST',
        url: "https://api.lifx.com/v1/lights/all/state",
         headers: {
             
         },
         beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization","Bearer c081387548f098b18c10847dfe193371c438c481334b6d41989e45965c56ad12");
           
        },
         data: {"power": "off"},
         
        success: function(data) {
            //var r = JSON.parse(data); 
            console.log("success", data)
            // if (checkCookie() == true) {
            //     var devURL = prodURL + "locations/groups/CALIB?wf_tkn=" + usertoken
            //     getdevices(devURL, drawtable)
            // }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr)
            alert(xhr.status + " : "+xhr.responseText);
        }
    });
}