require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')



app.use(express.static('dist'))

var morgan = require('morgan')

const errorHandler = (error, req, res, next) => {

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }
  next(error)
}


const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))


const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).send({
      error: 'Required information is missing'
    })
  }
  /*if(persons.find(person => person.name === body.name)) {
    return res.status(422).json({
      error: 'name must be unique'
    })
  }*/  
  const person = new Contact({
    name: body.name,
    number: body.number,
    
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})


app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/api/info', (req, res) => {
  Contact.find({}).then(contacts => {
  const info = `
    <p>Phonebook has info for ${contacts.length} people</p>
    <p>${new Date()}</p>`
  res.send(info)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(person => {
    if (person) {
      const modObject = {
        name: person.name,
        number: person.number,
        id: person._id.toString()
      }
      res.json(modObject)
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id).then(result => {
      res.status(204).end()  
  })
  .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})