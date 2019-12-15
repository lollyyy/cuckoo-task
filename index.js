const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.json('Hello world')
})

const PORT  = process.env.PORT || 3001
 app.listen(PORT, () => {
   console.log(`Server running on ${PORT}`)
 })
