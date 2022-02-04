const { MongoClient } = require("mongodb");
const { exit } = require("process");
const { mongouri } = require("./common");
(async () => {
  const start = performance.now();
  const client = new MongoClient(mongouri);
  await client.connect();
  const threads = client.db("metahkg-threads").collection("conversation");
  const t = await threads
    .find({ id: 1 })
    .project({
      conversation: {
        $filter: {
          input: "$conversation",
          cond: {
            $and: [{ $gte: ["$$this.id", 3] }, { $lte: ["$$this.id", 3] }],
          },
        },
      },
    })
    .toArray();
  const thread = await threads.findOne({ id: 40 });
  console.log(thread?.conversation.findIndex((i) => i.id === Number("1")));
  console.log(thread?.conversation.findIndex((i) => i.id === Number("4")));
  console.log(t);
  console.log(performance.now() - start);
  exit(0);
})();
