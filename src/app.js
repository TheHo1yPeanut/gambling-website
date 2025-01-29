const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const models = require("./config")

const app = express();
const PORT = process.env.PORT || 3000;

var gameActive = false;

var mineArray = [];
var globalMineNumber = 0;
var globalUnclickedTiles = [];
var globalBet = 0;

var currentMultiplier = 1;
var ROI = 0.97;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));

app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000 
    }
}));

app.use((req, res, next) => {
    if (req.session) {
        req.session.touch(); // Reset the session expiration timer
    }
    next();
});

function checkAuth(req, res, next) {
    if (req.session.userID) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}

// Routes
app.get('/', checkAuth, async (req, res) => {
        try{
            const userData = await models.userModel.findOne({ name: req.session.userID });
                res.render("main", { userData: userData });

        } catch(error) {
            console.log(error);
        }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});


app.get("/main", checkAuth, async (req, res) => {
        try{
            const userData = await models.userModel.findOne({ name: req.session.userID });
                res.render("main", { userData: userData });

        } catch(error) {
            console.log(error);
        }
});

app.get("/logout", checkAuth, (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.post("/userLogin", async (req, res) => {

    var data = {
        name: req.body.name,
        password: req.body.password
    }

    try{
        const userExists = await models.userModel.findOne({name: data.name});

        if(!userExists){
            res.end();
        } else {
            if(userExists.password == data.password){
                console.log("correct");
                req.session.userID = userExists.name;
                res.redirect("/main");
            } else {
                res.end();
            }
        }
    }catch{
        console.log("Something went wrong");
    }

});

app.post("/userSignup", async (req, res) => {

    var data = {
        name: req.body.name,
        password: req.body.password,
        balance: 1000
    }

    try{
        const userExists = await models.userModel.findOne({name: data.name});

        if(!userExists){
            const userExists1 = await models.userModel.insertMany(data)
            req.session.userID = userExists1.name;
            res.redirect("/main")
        } else {
            res.end();
            console.log("user exists")
        }
    }catch (error){
        console.log(error);
    }
});

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


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});