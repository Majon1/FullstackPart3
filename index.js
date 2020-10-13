const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const url =
  `mongodb+srv://testingUser48:6SZmGxwCLHA2yQgl@cluster0.al01h.mongodb.net/persons?retryWrites=true&w=majority`
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

 morgan.token('json', function(req, res) { 
  return JSON.stringify({
    name: req.body.name,
    number: req.body.number
  })
 })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.random(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase()))
    {
        return response.status(400).json({ 
            error: body.name + ' already in phonebook!' 
          })
    }
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }

    persons = persons.concat(person)
  
    response.json(person)
  })

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person)
    {
    response.json(person)
    }
    else 
    {
        response.status(404).end()
    }
  })

app.get('/info', (req, res) => {
    const amount = persons.length
    res.send('Phonebook has info for ' + amount + ' people' + '</br>' + new Date())
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`) 
})
