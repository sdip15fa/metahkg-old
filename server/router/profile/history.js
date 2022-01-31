const express = require('express')
const isInteger = require('is-sn-integer')
const { MongoClient } = require('mongodb')
const { mongouri } = require('../../common')
const router = express.Router()
/*
 * get summary of threads created by a user
 * syntax: GET /api/history/<user-id | "self">
 * returns an array of objects
 */
router.get('/api/history/:id', async (req, res) => {
  if (
    (!isInteger(req.params.id) && !req.params.id === 'self') ||
    (req.query.sort !== 'post' && req.query.sort !== 'comments')
  ) {
    res.status(400)
    res.send('Bad request.')
    return
  }
  const client = new MongoClient(mongouri)
  try {
    await client.connect()
    const users = client.db('metahkg-users').collection('users')
    const summary = client.db('metahkg-threads').collection('summary')
    const key = req.cookies.key
    const user = await users.findOne(
      req.params.id === 'self' ? { key: key } : { id: Number(req.params.id) }
    )
    if (!user) {
      res.status(404)
      res.send('User not found.')
      return
    }
    const sort = {
      post: { createdAt: -1 },
      comments: { lastModified: -1 }
    }[req.query.sort]
    const history = await summary
      .find({ op: user.user })
      .sort(sort)
      .limit(100)
      .project({ _id: 0 })
      .toArray()
    if (!history.length) {
      res.send([404])
      return
    }
    res.send(history)
  } finally {
    await client.close()
  }
})
module.exports = router
