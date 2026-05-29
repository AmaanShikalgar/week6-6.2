const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randomamaanlovesburgers";
const app = express();


app.use(express.json());

const users =[]

function credentials(req){
    return{
        username: req.body.username,
        password: req.body.password
    };
}

function signUp(req,res){

    const{username,password} = credentials(req);
    
    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are Signed Up"
    })
}    

function signIn(req,res){

    const{username,password} = credentials(req);

    let foundUser = null;
    
    for(let i =0;i<users.length;i++){
        if(users[i].username === username && users[i].password === password ){
            foundUser = users[i]
        }
    }

    if(foundUser){
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

        res.json({
            token: token
        })
    }else{
        res.status(403).send({
            message:"Invalid username or password"
        })
    }
}

function me(req,res){
    let foundUser = null;

    for(let i=0;i<users.length;i++){

        if(users[i].username === req.username){
            foundUser = users[i]
        }
    }
    
    if(foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }else{
        res.json({
            message:"token invalid"
        })
    }
}

function logger(req,res,next){
    console.log(req.method + " request came");
    next();
}

app.post("/SigningUp",logger,signUp);

app.post("/SigningIn",logger,signIn);

function auth(req,res,next){
    const token = req.headers.token; //now jwt

    const decodedinformation = jwt.verify(token,JWT_SECRET);
    const username = decodedinformation.username;

    if (username){
        req.username = decodedinformation.username;
        next();
    }else{
        res.json({
            message:"You are not logged in"
        })
    }
}

app.get("/me",logger,auth,me);

app.listen(3000,function(){
    console.log("Server running on 3000")
})