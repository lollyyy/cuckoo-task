const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
  taskname: String,
  taskdescription: String,
  completed: Boolean,
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List'
    }
  ]
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
