const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const tasksRouter = require('./controllers/tasks')
const mongoose = require('mongoose')
const morgan = require('morgan')

// Add Morgan logging
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

console.log('Connecting to ', config.MONGODB_URI)

// Use new mongoDB URL parser and 'server discovery and monitoring engine'
// Connect to MongoDB instance
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

// enqueue cors
app.use(cors())

// enqueue bodyParser middleware
app.use(bodyParser.json())

// enqueue mongoose router for tasks
app.use('/api/tasks', tasksRouter)

app.get('/', (req, res, next) => {
  res.json('Hello world')
})

app.listen(config.PORT, () => {
  console.log(`Server running on ${config.PORT}`)
})
