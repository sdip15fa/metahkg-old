const express = require("express");
const is_number = require("is-number");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const router = express.Router();
router.get('/api/profile/:id', async (req, res) => {
    if (!is_number(req.params.id) && !req.params.id === "self") {
        res.status(400);
        res.send("Bad request");}
    const client = new MongoClient(mongouri);
    try {
        await client.connect();
        const users = client.db("metahkg-users").collection("users");
        const user = (await users.find({id: Number(req.params.id)}).project({user: 1, createdAt: 1, _id: 0}).toArray())[0];
        if (!user) {res.status(404); res.send("User not found"); return;}
        res.send(user);}
    finally {await client.close();}})
module.exports = router;