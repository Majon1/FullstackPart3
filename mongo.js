const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const names = process.argv[3]
const numbers = process.argv[4]
const url =
  `mongodb+srv://username:password@cluster0.al01h.mongodb.net/persons?retryWrites=true&w=majority
  `
  //username:password

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//add new persons 
const person = new Person({
  name: names,
  number: numbers,
})

person.save().then(result => {
  console.log('added ' + person.name + ' number ' + person.number + ' to phonebook')
  mongoose.connection.close()
})
/*
//show all persons
Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })*/