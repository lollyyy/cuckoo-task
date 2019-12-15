const tasksRouter = require('express').Router()

const Task = require('../models/task')

// Get all tasks
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({})
  res.json(tasks.map(task => task.toJSON()))
})

// Add new task
tasksRouter.post('/', async (req, res, next) => {
  const body = req.body

  const task = new Task({
    taskname: body.taskname,
    taskdescription: body.description
  })

  try {
    const savedTask = await task.save()
    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = tasksRouter
