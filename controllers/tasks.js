const tasksRouter = require('express').Router()

const Task = require('../models/task')
const List = require('../models/list')

// Get all tasks
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({})
  res.json(tasks.map(task => task.toJSON()))
})

// Add new task
tasksRouter.post('/', async (req, res, next) => {
  const body = req.body
  console.log(body.list)

  const list = await List.findById(body.list)

  const task = new Task({
    taskname: body.taskname,
    taskdescription: body.taskdescription,
    completed: false,
    list: list._id
  })

  try {
    const savedTask = await task.save()
    list.tasks = list.tasks.concat(savedTask._id)
    await list.save()
    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

// Update existing task
tasksRouter.patch('/:id', async (req, res, next) => {
  const body = req.body

  const task = {
    taskname: body.taskname,
    taskdescription: body.description
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, task, { new: true })
    res.json(updatedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

// Remove task
tasksRouter.delete('/:id', async (req, res, next) => {
  try {
    await Task.findByIdAndRemove(req.params.id)
    res.send(`Task with id ${req.params.id} removed`)
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = tasksRouter
