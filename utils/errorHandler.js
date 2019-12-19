const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  error.name === 'CastError' && error.kind === 'ObjectId'
    ? res.status(400).send({ error: 'an error has occured' })
    : next(error)
  error.name === 'ValidationError' && res.status(400).json({ error: error.message })

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }
