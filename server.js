const express = require('express');
const bodyParser = require("body-parser");
const {v4 : uuidv4} = require("uuid");
const port = 3000;
const app = express();
const redis = require("redis");
const md5 = require('md5');
const {createClient} = require('redis');
const redisClient = createClient(
    {
        Url:'redis://default@localhost:6379',
    }
)

app.use(bodyParser.json());

app.listen(port, async ()=>{
    await redisClient.connect();
    console.log('listening on port '+port);
});

app.get('/', (req,res)=>{
    res.send('Hello Felipe')
});

app.post('/user', (req,res)=>{
    const newUserRequestObject = req.body;
    console.log ('New user:', JSON.stringify(newUserRequestObject));
    redisClient.hSet('users',req.body.email,JSON.stringify(newUserRequestObject));
    res.send('New user'+ newUserRequestObject.email +' added');
})

app.post("/login", (req,res)=>{
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    
    //res.send("Who are you");
    if (loginEmail == "555@co5.com" && loginPassword == "P@ssw0rd"){
        const token = uuidv4();
        res.send(token);
    } else{
        res.status(401);//unauthorized
        res.send("Invalid user or password");
    }
})