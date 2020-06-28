const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const tasksRouter = require('./controllers/tasks')
const listRouter = require('./controllers/lists')
const mongoose = require('mongoose')
const morgan = require('morgan')
const errorHandler = require('./utils/errorHandler')
const axios = require('axios')

//Create new HTTP server instance for Socket.io
const server = require('http').createServer(app)

//Init Socket.io & allow all origins
const io = require('socket.io')(server, { origins: '*:*' })

server.listen(config.PORT)

// enqueue cors
app.use(cors())

// enqueue bodyParser middleware
app.use(bodyParser.json())

app.use(express.static('build'))

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

// enqueue express router for tasks
app.use('/api/tasks', tasksRouter)

// enqueue express router for lists
app.use('/api/lists', listRouter)

// enqueue errorHandler middleware
app.use(errorHandler.errorHandler)
app.use(errorHandler.unknownEndpoint)

let listsArray = []

setInterval(() => {
	axios.get(`/api/lists`, {port: config.PORT})
	.then(res => {
	  listsArray = res.data
	})
	.catch(err => console.error(err))
  }, 500)

//Function for Socket.io traffic
io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing with interval ', interval)
  setInterval(() => {
    io.emit('timer', new Date())
  }, interval)
  })
  client.on('getLists', (interval) => {
	
	setInterval(() => {
	console.log('client subscribed to lists with interval', interval)
	io.emit('lists', listsArray)
	client.disconnect()
	}, interval)
  })
})