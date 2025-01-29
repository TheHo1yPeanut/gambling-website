var login = document.getElementById("loginButton");

var NAME = document.getElementById("username");
var PASS = document.getElementById("password");

login.addEventListener("click", () => {

        var data = {
            name: NAME.value,
            password: PASS.value,
        };
    
        console.log("pressed");
      
        fetch("/userLogin", {method: "POST", headers: {"Content-type": "application/json"}, body: JSON.stringify(data)}).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.log("something");
            }
        });
    
  });