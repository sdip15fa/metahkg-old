const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
async function autodecrement() {
  const client = new MongoClient(mongouri);
  await client.connect();
  const hottest = client.db("metahkg-threads").collection("hottest");
  await hottest.updateMany({}, { $inc: { c: -1 } });
}
module.exports = { autodecrement };
