require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('json', function (req) {
  return JSON.stringify({
    name: req.body.name,
    number: req.body.number
  })
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


const generateId = () => {
  const id = Math.random() * 20
  return id
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person
    .countDocuments(req.params.id)
    .then(p => {
      res.send('Phonebook has info for ' + p + ' persons' + '</br>' + new Date())
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(
      response.status(204).end()
    )
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedNumber => {
      response.json(updatedNumber.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
