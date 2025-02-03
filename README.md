# Mines gambling game

This project is a simple web application that implements a basic login feature using MongoDB, Mongoose, and EJS. It is a mines game from those online gambling websites which I have recreated. The application is built with Express and can be easily run using Nodemon for development.

![image](https://github.com/user-attachments/assets/fd1b6a43-c8a8-43f9-bf2e-b42407e148ed)


## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd simple-website
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up MongoDB**:
   Ensure you have MongoDB installed and running. Update the connection string in `src/config.js` if necessary.
   A.K.A.
   ```
   const connect = mongoose.connect('YOUR CONNECTION STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
   });
   ```

5. **Run the application**:
   ```
   npm run dev
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` to view the home page. You can access the login page from there.

<hr>

# Technical documentation

This documentation only focuses on parts and aspects of the project that I personally found to be the most important. Also those that i think my teacher would appreciate most since this work is judged.

## Backend Connection Setup

The connection to the database is established in the config.js file. The following code establishes a connection to a database in my personal cluster and checks if the connection is successful:
 ```
const connect = mongoose.connect('YOURSTRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


connect.then(() => {
    console.log("connection");
}).catch(() => {
    console.log("failed to connect");
});
 ```

Furthermore the config.js file includes the mongoose schema that is responsible for sending data packets to the database. The schema is a template for the way a datapacket should be structured when it is operated on.
 ```
const loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
});
 ```

## Session and authorization
The service is able to detect if a user has already logged in and therefore let them into the website in an already logged in state. This happens through the session that is initialized with the following code:
 ```
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000 
    }
}));
 ```
The settings are irrelevant, the only thing worth noting is the maxAge setting of the cookie. This is set to 10 minutes, meaning that the session will self terminate after that time has elapsed. If however the user shows signs of activity through sending a GET or POST request, the session timer restarts. This is done with the following code:
 ```
app.use((req, res, next) => {
    if (req.session) {
        req.session.touch(); // Reset the session expiration timer
    }
    next();
});
 ```
To check if a user has logged in we need to see if a session.userID exists for the user. This is because the session.userID is created upon a successful login, therefore the existance of a session.userID must mean a successful login within the active session. The authorization check happens in the aptly named function checkAuth():
 ```
function checkAuth(req, res, next) {
    if (req.session.userID) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}
 ```

## Paths, GET and POST operations
The exploitable GET and POST operations are protected with checkAuth() so they cannot be abused by an unothourized user. The /userLogin and /userSignup paths are unprotected because there is no way to abuse them. Besides protecting the /userLogin with checkAuth() would be useless since the checkAuth() can only be passed after a successful login. Most of the paths are simple renders of the view EJS files, but some are used for game logic. The reason the game logic is concentrated server side is because otherwise it can easily be exploited by the user through their console. This means that every single vulnarable operation is handled by the backend and the user can never adjust values that are sent to the server. The game logic paths are written as follows:
 ```
function scrambleMines(mineNumber){
    const numbers = [];
    while (numbers.length < mineNumber) {
        const randomNumber = Math.floor(Math.random() * 25) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers;
}

app.post("/mineCheck", checkAuth, async (req, res) => {
    var data = {
        mineID: req.body.mineID
    }

    let clickedTileNum = 0;

    try{
        console.log(data.mineID);

        console.log(mineArray);

        if(globalUnclickedTiles.includes(parseInt(data.mineID))){
            globalUnclickedTiles.splice(globalUnclickedTiles.indexOf(parseInt(data.mineID)), 1);
            if(mineArray.includes(parseInt(data.mineID))){
                res.status(200).json({success: false});
                console.log("mine hit");
            } else {
                clickedTileNumTileNum = 25 - globalUnclickedTiles.length;
            
                currentMultiplier = currentMultiplier * ((globalUnclickedTiles.length - clickedTileNum + 1)/(globalUnclickedTiles.length - globalMineNumber + 1)) * ROI;
                res.status(200).json({success: true, currentMultiplier: currentMultiplier});
            }
        } else {
            console.log("already clicked");
        }

        res.end();
    } catch(error){
        console.log(error);
    }

});

app.post("/play", checkAuth, async (req, res) => {
    var data = {
        mineNumber: req.body.mineNumber,
        betAmount: req.body.betAmount
    }

    currentMultiplier = 1;

    globalBet = data.betAmount;

    globalMineNumber = data.mineNumber;
    globalUnclickedTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    try{
        const userData = await models.userModel.findOne({ name: req.session.userID });
        console.log(data.mineNumber);
        console.log(data.betAmount);
    
        if (data.mineNumber <= 0 || data.betAmount <= 0 || data.betAmount > userData.balance) {
            return res.status(400).json({ error: 'Invalid input' });
        }
    } catch(error){
        console.log(error);
    }


    gameActive = true;
    mineArray = [];
    mineArray = scrambleMines(data.mineNumber);
    console.log(mineArray);

    try{
        const userData = await models.userModel.findOne({ name: req.session.userID });
        await models.userModel.updateOne({name: req.session.userID}, {balance: userData.balance - data.betAmount});
        console.log(data.mineNumber);
        return res.status(200).json({balance: (userData.balance - data.betAmount).toFixed(2)});
    } catch(error){
        console.log(error);
    }
}); 

app.post("/add", checkAuth, async (req, res) => {

    try{
        const userData = await models.userModel.findOne({ name: req.session.userID });
        console.log(userData.balance);
        console.log(globalBet);    
        await models.userModel.updateOne({name: req.session.userID}, {balance: userData.balance + globalBet * currentMultiplier});
        res.status(200).json({balance: (userData.balance + globalBet * currentMultiplier).toFixed(2)});
    } catch(error){
        console.log(error);
    }

});
 ```

These lines of code are responsible for most of what happens in the game. The scrambleMines() function simply returns an array populated at random with the number of positions of mines the user choses to play with. As the name suggests, the /mineCheck path is responsible for checking the status of a square and sending feedback to the client side code. It also automatically corrects the values in the database if a user happens to lose the game on a given mine click. The /play path is responsible for setting up the game field values, it is important that this is located on the server side because the user cannot be allowed to change mine positions once the game starts. The /add path simply updates the balance value of the active user when necessary. 

## Front end JavaScript
There is virtually no notable code in the front end part of the project except for the fetch() functions that are used in order to communicate with the server. An example of this fetch() function is used in the front end part of the mine checking algorithm:
 ```
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
 ```
This snippet recieves data from the server about the status of the square that was clicked. If the square happens to be a mine the game restarts and the visuals are applied. If however the square is not a mine, the game continues and the current multiplier gets displayed on the clicked square. The fetch() requests are used in all places where the program is required to be discrete with it's values and the way it handles them.

## CSS and visuals
The way the mines are flipped is with the help of the transform and transition properties. If the mine has the class "flipped", then a rotation of 180 degrees is applied to it. Thanks to the transition this rotation is animated and does not happen instanteinously. 
 ```
.mine-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    border-radius: 0.8vh;
}

.mine.flipped .mine-inner {
    transform: rotateY(180deg);
}
 ```

























