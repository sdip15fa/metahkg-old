require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const { autodecrement } = require('./router/menu/autodecrement')
const rootRouter = express.Router()
require('dotenv').config()
const app = express()
/*
 * Decrease count by one in collection "hottest" every 2 hours
 */
setInterval(() => {
  setTimeout(() => {
    autodecrement()
  }, 7200 * 1000)
}, 7200 * 1000)
app.disable('x-powered-by')
/*
 * Get client ip from cloudflare
 */
app.set('trust proxy', true)
/*
* Set content security policy
* js.hcaptcha.com: hcaptcha
* sa.wcyat.engineer, analytics.wcyat.me,
  static.cloudflareinsights.com: analytics
* cdnjs.cloudflare.com: deliver axios
  for usage in the browser console
*/
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.hcaptcha.com https://sa.wcyat.engineer https://analytics.wcyat.me https://static.cloudflareinsights.com https://cdnjs.cloudflare.com"
  )
  return next()
})
app.use(cookieParser())
/*
* If there's a path specified in router
  for the request, the request is responded
  by the api
* Otherwise the React app would be served
*/
app.use(require('./router'))
app.use(express.static('build'))
rootRouter.get('(/*)?', async (req, res) => {
  res.sendFile('index.html', { root: 'build' })
})
app.use(rootRouter)
/*
 * The port can be modified in .env
 */
app.listen(process.env.port, () => {
  console.log(`listening at port ${process.env.port}`)
})
