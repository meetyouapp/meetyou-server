require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const cors = require('cors')
const router = require('./routes/index')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', router)

app.listen(port, () => {
  console.log(`meetyou-server running on port`, port)
})