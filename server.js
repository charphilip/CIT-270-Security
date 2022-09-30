const express = require('express');
const bodyParser = require("body-parser");
const {v4 : uuidve} = require("uuid");
const port = 3000;
const app = express();

app.use(bodyParser.json());

app.listen(port, async ()=>{
    console.log('listening on port '+port);
});

app.get('/', (req,res)=>{
    res.send('Hello Felipe')
});

app.post("/login", (req,res)=>{
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    res.send("Who are you");
    // if (loginEmail == "555@co5.com")
})