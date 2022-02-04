const { mongouri, objtoarr } = require("./common");
const { MongoClient } = require("mongodb");
(async () => {
  const client = new MongoClient(mongouri);
  await client.connect();
  const threads = client.db("metahkg-threads").collection("conversation");
  const summary = client.db("metahkg-threads").collection("summary");
  threads.find().forEach(async (i) => {
    await summary.updateOne(
      { id: i.id },
      { $set: { slink: (await threads.findOne({ _id: i._id })).slink } }
    );
    await threads.replaceOne(
      { _id: i._id },
      {
        conversation: objtoarr(i.conversation),
        lastModified: i.lastModified,
        _id: i._id,
        id: i.id,
      }
    );
  });
})();
