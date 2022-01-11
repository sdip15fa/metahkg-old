const express = require('express');
const body_parser = require('body-parser');
const { MongoClient } = require('mongodb');
const cookieParser = require("cookie-parser");
const rootRouter = express.Router();
const mailgun = require("mailgun-js");
const random = require('random');
const rg = require("wcyat-rg");
const { verify } = require('hcaptcha');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const bcrypt = require('bcrypt');
const EmailValidator = require('email-validator');
const isNumber = require('is-number');
require('dotenv').config();
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const app = express();
const DOMAIN = 'metahkg.wcyat.me';
const secret = process.env.hcaptchasecret;
const mg = mailgun({apiKey: process.env.api_key, domain: DOMAIN});
const mongouri = process.env.DB_URI;
const client = new MongoClient(mongouri);
app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://js.hcaptcha.com https://sa.wcyat.engineer https://analytics.wcyat.me https://static.cloudflareinsights.com https://cdnjs.cloudflare.com");
    return next();});
app.use(cookieParser());
app.post('/api/register', body_parser.json(), async (req, res) => {
    if (!req.body.user || !req.body.pwd || !req.body.htoken ||
        !req.body.email || !req.body.sex ||  !(typeof req.body.user === "string" && typeof req.body.pwd === "string" 
        && typeof req.body.email === "string" && typeof req.body.htoken === "string") || 
        req.body.sex !== "female" && req.body.sex !== "male"
        || Object.keys(req.body).length > 5 || !EmailValidator.validate(req.body.email))
        {res.status(400);res.send("Bad request");return;}
    const hvalid = await verify(secret, req.body.htoken);
    if (!hvalid.success) {res.status(400);
        res.send("hCaptcha token invalid.");
        return;}
    await client.connect();
    const verification = client.db("metahkg-users").collection("verification");
    const users = client.db("metahkg-users").collection("users");
    const code = random.int((min = 100000), (max = 999999))
    if (await users.countDocuments({user : req.body.user}) || await verification.countDocuments({user : req.body.user})) {res.status(409); res.send("Username exists.");}
    else if (await users.countDocuments({email : req.body.email}) || await verification.countDocuments({email : req.body.email})) {res.status(409); res.send("Email exists.");}
    else {const verify = {from : "Metahkg support <support@metahkg.wcyat.me>",
        to : req.body.email,
        subject : "Metahkg verification code",
        text : `Your verification code is ${code}.`}
    await mg.messages().send(verify, function (error, body) {console.log(body);});
    const hashed = await bcrypt.hash(req.body.pwd, 10);
    await verification.insertOne({
        createdAt : new Date,
        code : code,
        email : req.body.email,
        pwd : hashed,
        user : req.body.user,
        sex : req.body.sex})
    res.send("Ok");}})
app.post('/api/verify', body_parser.json(), async (req,res) => {
    if (!req.body.email || !req.body.code || !(typeof req.body.email === "string" && 
    typeof req.body.code === "number") || Object.keys(req.body).length > 2 || 
    !isNumber(req.body.code) || req.body.code.length !== 6) 
    {res.status(400); res.send("Bad request");return;}
        await client.connect();
        const verification = client.db("metahkg-users").collection("verification");
        const users = client.db("metahkg-users").collection("users");
        const data = await verification.findOne({email : req.body.email});
        if (!data) {res.status(404); res.send("Not found. Your code night have expired.")}
        else if (data.code !== req.body.code) {res.status(401); res.send("Code incorrect.")}
        else {delete data._id; delete data.code;
            data.key = rg.generate({include: {numbers:true,upper:true,lower:true,special:false},digits:30})
            data.id = await users.countDocuments({}) + 1;
            await users.insertOne(data);
            res.cookie('key', data.key, {domain: process.env.domain, secure: true, httpOnly: true, path: '/'});
            res.send({id : data.id, key : data.key}); await verification.deleteOne({email : req.body.email});}})
app.post('/api/signin', body_parser.json(), async (req, res) => {
    if (!req.body.user || !req.body.pwd || 
        Object.keys(req.body).length > 2 || !(typeof req.body.user === "string" && typeof req.body.pwd === "string"))
    {res.status(400); res.send("Bad request");return;}
    await client.connect();
    const users = client.db("metahkg-users").collection("users");
    const data = await users.findOne({user : req.body.user}) || await users.findOne({email : req.body.user});
    if (!data) {res.status(404); res.send("User not found");return;};
    const correct = await bcrypt.compare(req.body.pwd, data.pwd);
    if (!correct) {res.status(401); res.send("Password incorrect");return;};
    res.cookie('key', data.key, {domain: process.env.domain, secure: true, httpOnly: true, path: '/'});
    res.send({key : data.key, id: data.id, user : data.user});})
//get conversation
app.get('/api/thread/:id/:file', async (req, res) => {
    await client.connect();
    try {const c = client.db('metahkg-threads').collection(req.params.file);
        const result = await c.findOne({id : Number(req.params.id)});
        if (!result) {res.status(404); res.send("Not found");}
        else{res.send(result)};}
    finally {await client.close()}})
//add a comment
app.post('/api/comment', body_parser.json(), async (req, res) => {
    if (!req.body.id || !req.body.comment || Object.keys(req.body).length > 2
    || !(typeof req.body.id === "number" && typeof req.body.comment === "string")) 
    {res.status(400); res.send("Bad request"); return;}
    await client.connect();
    try {const conversation = client.db('metahkg-threads').collection('conversation');
        const users = client.db('metahkg-threads').collection('users');
        const summary = client.db("metahkg-threads").collection("summary");
        const metahkgusers = client.db("metahkg-users").collection('users');
        const key = req.cookies.key;
        const user = await metahkgusers.findOne({key : key});
        if (!await metahkgusers.findOne({key : key}) || !await conversation.findOne({id : req.body.id})) 
        {res.status(404); res.send("Not found.");return;}
        await conversation.updateOne({id : req.body.id}, 
        {$set : { [`conversation.${(await summary.findOne({id : req.body.id})).c + 1}`]:
        {user : user.id, 
        comment : DOMPurify.sanitize(req.body.comment), createdAt : new Date}}, 
        $currentDate: {lastModified : true}})
        await summary.updateOne({id : req.body.id}, {$inc : {c : 1},
        $currentDate : {lastModified : true}});
        if (!await users.findOne({id : req.body.id})[user.id]) {
        await users.updateOne({id : req.body.id}, {$set : {[user.id] : {sex : user.sex, name : user.user}}})}
        res.send("ok");
    } finally {await client.close()}})
app.post('/api/create', body_parser.json(), async (req, res) => {
    if (!req.body.icomment || !req.body.htoken || !req.body.title || Object.keys(req.body).length > 3
    || !(typeof req.body.icomment === "string" && typeof req.body.title === "string" && 
    typeof req.body.htoken === "string")) {res.status(400); res.send("Bad request.");return;}
    const hvalid = await verify(secret, req.body.htoken);
    if (!hvalid.success) {res.status(400);
    res.send("hCaptcha token invalid.");return;}
    try {await client.connect();
        const metahkgusers = client.db('metahkg-users').collection('users');
        const user = await metahkgusers.findOne({key : req.cookies.key});
        if (!user) {res.status(404); res.send("User not found."); return;};
        const limit = client.db('metahkg-users').collection('limit');
        if (await limit.countDocuments({id : user.id, type : "create"}) >= 10)
        {res.status(429); res.send("You cannot create more than 10 topics a day.");return;}
        const summary = client.db('metahkg-threads').collection('summary');
        const conversation = client.db('metahkg-threads').collection('conversation');
        const users = client.db('metahkg-threads').collection('users');
        const newcid = await conversation.countDocuments({}) + 1;
        const date = new Date;
        await conversation.insertOne({op : user.name, id : newcid,
        title : req.body.title, "conversation.1" : {user : user.id, comment : req.body.icomment,
        createdAt : date}, lastModified : date})
        await users.insertOne({id : newcid, [user.id] : {name : user.name, sex : user.sex}});
        await summary.insertOne({id : newcid, op : user.name, sex : user.sex, c : 1, vote : 0, 
            title : req.body.title, lastModified : date, createdAt : date});
        await limit.insertOne({id : user.id, createdAt: date, type : "create"});
        res.send({id : newcid});}
    finally {await client.close();}})
app.get('/api/logout', (req,res) => {
    res.cookie('key', 'none', {
        expires: new Date(Date.now() + 5),
        httpOnly: true,
        domain : process.env.domain})
    res.status(200).json({success: true, message: 'User logged out successfully'})})
app.post('/api/check', body_parser.json(), async (req,res) => {
    if (!req.body.id || Object.keys(req.body) > 1 || typeof req.body.id !== "number") 
    {res.status(400); res.send("Bad request."); return;};
    try {await client.connect();
        if (!(await client.db("metahkg-threads").collection("conversation").findOne({id : req.body.id})))
        {res.status(404); res.send("Not found.");return;}
        res.send("ok");} finally {
        await client.close();};})
app.use(express.static('build'))
rootRouter.get('(/*)?', async (req, res, next) => {
    res.sendFile('index.html', { root: 'build' });});
app.use(rootRouter);
app.listen(process.env.port, () => {
    console.log(`listening at port ${process.env.port}`);})