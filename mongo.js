const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const names = process.argv[3]
const numbers = process.argv[4]
const url = process.env.MONGODB_URI


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

if (process.argv.length < 4) {
//show all persons
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