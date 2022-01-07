const express = require('express');
const body_parser = require('body-parser');
const { MongoClient } = require('mongodb');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const rootRouter = express.Router();
const app = express();
const mailgun = require("mailgun-js");
const emailChk = require('email-chk')
const random = require('random');
const rg = require("wcyat-rg");
const { execPath } = require('process');
require('dotenv').config();
const DOMAIN = 'metahkg.wcyat.me';
const mg = mailgun({apiKey: process.env.api_key, domain: DOMAIN});
const mongouri = process.env.DB_URI;
const client = new MongoClient(mongouri);
app.use(cors());
app.use(cookieParser());
app.post('/api/register', body_parser.json(), async (req, res) => {
    await client.connect();
    const verification = client.db("metahkg-users").collection("verification");
    const users = client.db("metahkg-users").collection("users");
    const code = random.int((min = 100000), (max = 999999))
    if (!req.body.user || !req.body.pwd || 
        !req.body.email || Object.keys(req.body).length > 3) {
            res.status(400);res.send("Bad request");}
    else if (await users.find({user : req.body.user}).count() || await verification.find({user : req.body.user}).count()) {res.status(409); res.send("Username exists.");}
    else if (await users.find({email : req.body.email}).count() || await verification.find({email : req.body.email}).count()) {res.status(409); res.send("Email exists.");}
    else {
    try {const exists = await emailChk(req.body.email); if (!exists) {res.status(400); res.send("Email address doesn't exist.");}}
    catch(e) {res.status(400); res.send("Email address doesn't exist.");}
    const verify = {from : "Metahkg support <support@metahkg.wcyat.me>",
        to : req.body.email,
        subject : "Metahkg verification code",
        text : `Your verification code is ${code}.` }
    await mg.messages().send(verify, function (error, body) {console.log(body);});
    await verification.insertOne({
        createdAt : new Date(),
        code : code,
        email : req.body.email,
        pwd : req.body.pwd,
        user : req.body.user
    })
    res.send("Ok");}
})
app.post('/api/verify', body_parser.json(), async (req,res) => {
    if (!req.body.email || !req.body.code || Object.keys(req.body).length > 2) 
    {res.status(400); res.send("Bad request");} else {
        await client.connect();
        const verification = client.db("metahkg-users").collection("verification");
        const users = client.db("metahkg-users").collection("users");
        const data = await verification.findOne({email : req.body.email});
        if (!data) {res.status(404); res.send("Not found. Your code night have expired.")}
        else if (data.code !== req.body.code) {res.status(401); res.send("Code incorrect.")}
        else {delete data._id; delete data.code;
            data.key = rg.generate({include: {numbers:true,upper:true,lower:true,special:false},digits:16})
            data.id = await users.countDocuments({}) + 1;
            await users.insertOne(data); res.send({id : data.id, key : data.key}); await verification.deleteOne({email : req.body.email});}
}})
app.post('api/signin', body_parser.json(), async (req, res) => {
    if (!req.body.user || !req.body.pwd || Object.keys(req.body).length > 2) {res.status(400); res.send("Bad request");}
    else {
        await client.connect();
        const users = client.db("metahkg-users").collection("users");
        const data = await users.findOne({user : req.body.user}) || await users.findOne({email : req.body.email});
        if (!data) {res.status(404); res.send("User not found");}
        else if (data.pwd !== req.body.pwd) {
            res.status(401); res.send("Password incorrect");}
        else {res.send(data.key)}
    }
})
//get conversation
app.get('/api/thread/:id/:file', async (req, res) => {
    await client.connect();
    try {
        const c = client.db('metahkg-threads').collection(req.params.file);
        const result = await c.findOne({id : Number(req.params.id)});
        if (!result) {res.status(404); res.send("Not found");}
        else{res.send(result)};
    }
    finally {await client.close()}
})
//add a comment
app.post('/api/thread/:id', body_parser.json(), async (req, res) => {
    await client.connect();
    try {
        const conversation = client.db('metahkg-threads').collection('conversation');
        const users = client.db('metahkg-threads').collection('users');
    } finally {await client.close()}
})
app.use(express.static('build'))
rootRouter.get('(/*)?', async (req, res, next) => {
    res.sendFile('index.html', { root: 'build' });
});
app.use(rootRouter);
app.listen(3100, () => {
    console.log("listening at port 3100");
})