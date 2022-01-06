const express = require('express');
const body_parser = require('body-parser');
const { MongoClient } = require('mongodb');
const rootRouter = express.Router();
const app = express();
require('dotenv').config();
const mongouri = process.env.DB_URI;
app.get('/api/thread/:id/:file', async (req, res) => {
    const client = new MongoClient(mongouri);
    await client.connect();
    try {
        const c = client.db('metahkg-threads').collection(req.params.file);
        const result = await c.findOne({id : Number(req.params.id)});
        if (!result) {res.status(404); res.send("Not found");}
        else{res.send(result)};
    }
    finally {await client.close()}
})
app.post('/api/thread/:id', body_parser.json(), async (req, res) => {
    const client = new MongoClient(mongouri);
    await client.connect();
    try {
        const conversation = client.db('metahkg-threads').collection('conversation');
        const users = client.db('metahkg-threads').collection('users');
    } finally {await client.close()}
})
app.use(express.static('build'))
rootRouter.get('(/*)?', async (req, res, next) => {
    res.sendFile(path.join('build', 'index.html'));
});
app.use(rootRouter);
app.listen(3000, () => {
    console.log("listening at port 3000");
})