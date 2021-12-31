


//*****************************--------------login------------------********************************* */
//doLogin checks the login
function doLogin() {
    if ($("#uid").val() == "testuser" && $("#pwd").val() == "9876543") {
        usertoken = "tester";
        $(".hideable").hide();
        setCookie("usertoken", usertoken, 1);
        showHome();
    } else {
        usertoken = "";
        document.getElementById("uid").value = "";
        document.getElementById("pwd").value = "";
        document.getElementById("loginerror").innerHTML = "Login Error - check your username and password";

    };
}
//setcookie creates a cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "; secure; path=/";
}
//getCookie returns a cookie data
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//checkcookie, sees if a cookie exists and if not logs the user out
function checkCookie() {
    var user = getCookie("usertoken");
    if (user != "") {
        usertoken = user
        return true
    } else {
         logout()
     // return true
    }
}
//logout gets rid of the token and logs the user out
function logout() {
    setCookie("usertoken", "", -1)
    window.location.reload()
}
//before the page is reloaded it gets rid of the login cookie
window.onbeforeunload = function() {
    setCookie("usertoken", "", -1);
};


//***************************************settings********************************************* */
function showSettings() {
   if ( checkCookie()) {
        $(".hideable").hide();
        $("#settings").show();
   }
}

