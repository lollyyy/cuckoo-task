const listRouter = require('express').Router()

const List = require('../models/list')

// Get all lists
listRouter.get('/', async (req, res) => {
  const lists = await List.find({})
  res.json(lists.map(list => list.toJSON()))
})

// Add new list
listRouter.post('/', async (req, res, next) => {
  const body = req.body

  const list = new List({
    listname: body.listname,
    color: body.color
  })

  try {
    const savedList = await list.save()
    res.json(savedList.toJSON())
  } catch (exception) {
    next(exception)
  }
})

// Update existing task
listRouter.patch('/:id', async (req, res, next) => {
  const body = req.body

  const list = {
    listname: body.listname,
    color: body.color
  }

  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, list, { new: true })
    res.json(updatedList.toJSON())
  } catch (exception) {
    next(exception)
  }
})

// Remove task
listRouter.delete('/:id', async (req, res, next) => {
  try {
    await List.findByIdAndRemove(req.params.id)
    res.send(`List with id ${req.params.id} removed`)
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = listRouter
