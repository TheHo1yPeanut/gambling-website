var mineList = document.querySelectorAll('.mine');

var mineNumberInput = document.getElementById("mineNumberInput");

var playButton = document.getElementById("playButton");

var betInput = document.getElementById("numberInput");

var gameActive = false;

var logout = document.getElementById("logout");

logout.addEventListener('click', () => {

    console.log("logging out");
    
    fetch("/logout", {method: "GET"}).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log("something");
        }
    });
});

document.getElementById("moneyButton1").addEventListener('click', () => {
    if(betInput.value == ""){
        betInput.value = 0;
    }
    betInput.value = parseFloat(betInput.value) + 50;
});

document.getElementById("moneyButton2").addEventListener('click', () => {
    if(betInput.value == ""){
        betInput.value = 0;
    }
    betInput.value = parseFloat(betInput.value) + 100;
});

document.getElementById("moneyButton3").addEventListener('click', () => {
    if(betInput.value == ""){
        betInput.value = 0;
    }
    betInput.value = parseFloat(betInput.value) + 200;
});

function victory(){
    stopGame(true);
}

function stopGame(winCondition){
    if(!gameActive){
        return;
    } 
    
    if(!winCondition){
        console.log("game lost");
        gameActive = false;
        playButton.innerText = "PLAY";
        playButton.removeEventListener('click', victory);
        betInput.value = 0;
        mineNumberInput.value = 0;
        setTimeout(() => {
            for (var i = 0; i < mineList.length; i++){
                mineList[i].classList.remove('flipped');
                mineList[i].children[0].children[1].innerHTML = "";
                mineList[i].children[0].children[1].classList.remove("mine-safe");
                mineList[i].children[0].children[1].classList.remove("mine-hit");
            }

            betInput.value = "";
            mineNumberInput.value = "";
        }, 1500);
    } else {
        gameActive = false;
        playButton.innerText = "PLAY";
        playButton.removeEventListener('click', victory);
        betInput.value = 0;
        mineNumberInput.value = 0;
        setTimeout(() => {
            for (var i = 0; i < mineList.length; i++){
                mineList[i].classList.remove('flipped');
                mineList[i].children[0].children[1].innerHTML = "";
                mineList[i].children[0].children[1].classList.remove("mine-safe");
                mineList[i].children[0].children[1].classList.remove("mine-hit");
            }

            betInput.value = "";
            mineNumberInput.value = "";
        }, 1500);

        fetch("/add", {method: "POST"}).then(response => {
            return response.json();
        }).then(data => {
            document.getElementById("balanceContainer").innerText = `Current Balance: ${data.balance}`;
        });
    }
}

for (var i = 0; i < mineList.length; i++) {
  mineList[i].addEventListener('click', (e) => {
    if(gameActive){
        const target = e.currentTarget;
        e.currentTarget.classList.add('flipped');


        var data = {
            mineID: e.currentTarget.id
        }
    
    
        fetch("/mineCheck", {method: "POST", headers: {"Content-type": "application/json"}, body: JSON.stringify(data)}).then(response => {
            return response.json();
        }).then(data => {
            if(data.success == false){
                console.log("mine hit");
                target.children[0].children[1].classList.add("mine-hit");
                stopGame(false);

            } else {
                console.log("tile clicked");
                console.log(data.currentMultiplier);

                target.children[0].children[1].innerText = data.currentMultiplier.toFixed(2); 
                target.children[0].children[1].classList.add("mine-safe");
            }
        });
    }
  });
}

mineNumberInput.addEventListener('input', (e) => {

    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');

    if(e.currentTarget.value > 24){
        e.currentTarget.value = 24;
    }
    if(e.currentTarget.value < 0){
        e.currentTarget.value = 0;
    }
});


playButton.addEventListener('click', () => {
    if(gameActive){
        return;
    }

    if(mineNumberInput.value > 0 && betInput.value > 0){

        var data = {
            mineNumber: parseInt(mineNumberInput.value),
            betAmount: parseInt(betInput.value)
        }



        fetch("/play", {method: "POST", headers: {"Content-type": "application/json"}, body: JSON.stringify(data)}).then(response => {
            return response.json();
        }).then(data => {
            if(data.error){
                alert("There was an error starting the game, please make sure that your bet amount is less than or equal to your balance.");
            } else {
                console.log("game started");
                gameActive = true;
                playButton.innerText = "STOP";
                playButton.addEventListener('click', victory)
                document.getElementById("balanceContainer").innerText = `Current Balance: ${data.balance}`;
            }
        });
    } else {
        alert("Please enter a valid number of mines");
    }
});