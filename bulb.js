function ingestBulb() {
    $.ajax({
        type: 'GET',
        url: MYURL + "bulb.php",
        // headers: {
        //     "wf-tkn": usertoken,
        // },
        success: function(data) {
            //var r = JSON.parse(data); 
            console.log("success", data)
            // if (checkCookie() == true) {
            //     var devURL = prodURL + "locations/groups/CALIB?wf_tkn=" + usertoken
            //     getdevices(devURL, drawtable)
            // }
        },
        error: function(xhr, ajaxOptions, thrownError) {
           // var error = JSON.parse()
            alert(xhr.status + " : "+xhr.responseText);
        }
    });
}