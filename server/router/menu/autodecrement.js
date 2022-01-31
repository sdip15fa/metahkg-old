const { MongoClient } = require('mongodb')
const { mongouri } = require('../../common')
/*
* Decrease collection "hottest" documents count by 1
  for sorting popularity
*/
async function autodecrement () {
  const client = new MongoClient(mongouri)
  try {
    await client.connect()
    const hottest = client.db('metahkg-threads').collection('hottest')
    await hottest.updateMany({}, { $inc: { c: -1 } })
  } finally {
    await client.close()
  }
}
module.exports = { autodecrement }
