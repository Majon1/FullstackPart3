const mongoose = require('mongoose')
const password = process.argv[2]
const names = process.argv[3]
const numbers = process.argv[4]
const url = 
`mongodb+srv://fullstack:${password}@cluster0.al01h.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: names,
  number: numbers,
})

person.save().then(() => {
  console.log('added ' + person.name + ' number ' + person.number + ' to phonebook')
  mongoose.connection.close()})

if (process.argv.length < 4) {
  
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)

        mongoose.connection.close()
      })
      process.exit()
    })

}