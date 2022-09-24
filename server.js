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