const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

 morgan.token('json', function(req, res) { 
  return JSON.stringify({
    name: req.body.name,
    number: req.body.number
  })
 })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]

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
    res.json(persons)
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