var signup = document.getElementById("signupButton");

var NAME = document.getElementById("username");
var PASS = document.getElementById("password");



signup.addEventListener("click", () => {

    var data = {
        name: NAME.value,
        password: PASS.value,
    };

    console.log("pressed");
  
    fetch("/userSignup", {method: "POST", headers: {"Content-type": "application/json"}, body: JSON.stringify(data)}).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log("user exists");
        }
    });

});