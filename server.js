const express = require('express');
const bodyParser = require("body-parser");
const {v4 : uuidv4} = require("uuid");
const fs = require('fs');
const https = require('https');
const port = 4043;//3000
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

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(port, async () => {
    await redisClient.connect();
    console.log('Listening to you Felipe...')
});
// app.listen(port, async ()=>{ //It is listening to CURL (Client side-Browser)
//     await redisClient.connect();
//     console.log('listening on port '+port);
// });

app.get('/', (req,res)=>{
    res.send('Hello Felipe. Welcome to the server')
});

app.post('/user', (req,res)=>{
    const newUserRequestObject = req.body;
    console.log ('New user:', JSON.stringify(newUserRequestObject));
    const loginPassword = req.body.password
    const hashPassword = md5(loginPassword);
    console.log(hashPassword);
    newUserRequestObject.password = hashPassword;
    newUserRequestObject.verifyPassword = hashPassword;
    redisClient.hSet('users',req.body.email,JSON.stringify(newUserRequestObject));
    res.send('New user'+ newUserRequestObject.email +' added');
})

app.post("/login", async (req,res)=>{
    const newUserRequestObject = req.body;
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = md5(req.body.password);
    console.log("loginPassword", loginPassword);
    
    const userString = await redisClient.hGet('users', loginEmail);
    const userObject = JSON.parse(userString);
    if(userString == '' || userString == null){
        res.status(404);
        res.send('User not found!!');
    }
    else if (loginEmail == userObject.userName && loginPassword == userObject.password){
        const token = uuidv4();
        res.send(token);
    } else{
        res.status(401);//unauthorized
        res.send("Invalid user or password");
    }
    //res.send("Who are you");
    // if (loginEmail == "555@co5.com" && loginPassword == "P@ssw0rd"){
    //     const token = uuidv4();
    //     res.send(token);
    // } else{
    //     res.status(401);//unauthorized
    //     res.send("Invalid user or password");
    // }
})