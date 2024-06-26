require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelacee",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

const cors = require('cors')
var morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(req.body)
  if(!body.name || !body.number) {
    return res.status(400).json({
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
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
  Contact.findById(req.params.id).then(person => {
    if (person) {
      console.log(person)
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})