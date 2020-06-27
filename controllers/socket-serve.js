const axios = require('axios')

//Create new HTTP server instance for Socket.io
const server = require('http').createServer()
server.listen(3002, () => {
  console.log(`Server running on ${3002}`)
})

//Init Socket.io & allow all origins
const io = require('socket.io')(server, { origins: '*:*' })

let listsArray = []

setInterval(() => {
	axios.get('http://localhost:3001/api/lists')
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
    client.emit('timer', new Date())
  }, interval)
  })
  client.on('getLists', (interval) => {
	setInterval(() => {
	client.emit('lists', listsArray)
	client.disconnect()
	}, interval)
  })
})