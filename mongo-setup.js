const { MongoClient } = require("mongodb");
const { exit } = require("process");
const { mongouri } = require("./server/common");
async function setup() {
  const client = new MongoClient(mongouri);
  await client.connect();
  const metahkgthreads = client.db("metahkgthreads");
  const metahkgusers = client.db("metahkgusers");
  await metahkgthreads
    .collection("hottest")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 172800 });
  await metahkgthreads
    .collection("summary")
    .createIndex({ op: "text", title: "text" }); // text search
  await metahkgusers
    .collection("limit")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });
  await metahkgusers
    .collection("verification")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
  exit(0);
}
setup();
