const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb')
const { mongouri } = require('../common')
const isInteger = require('is-sn-integer')
router.get('/api/search', async (req, res) => {
  if (
    !req.query.q ||
    !req.query.sort ||
    !isInteger(req.query.sort) ||
    ![0, 1, 2].includes(Number(req.query.sort))
  ) {
    res.status(400)
    res.send('Bad request.')
    return
  }
  const client = new MongoClient(mongouri)
  try {
    await client.connect()
    const summary = client.db('metahkg-threads').collection('summary')
    const sortc = {
      0: {},
      1: { createdAt: -1 },
      2: { lastModified: -1 }
    }[req.query.sort]
    const data = await summary
      .find({ $text: { $search: req.query.q } })
      .sort(sortc)
      .limit(100)
      .toArray()
    res.send(data)
  } finally {
    await client.close()
  }
})
module.exports = router
