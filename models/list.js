const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
  listname: String,
  color: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
})

listSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const List = mongoose.model('List', listSchema)

module.exports = List
