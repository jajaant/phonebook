const express = require('express')
const app = express()

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


const idGenerator = () => {
  const random = Math.random()
  const id = random.toString().slice(2)
  
  return Number(id)
  }

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(req.body)
  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'Required information is missing'
    })
  }


  if(persons.find(person => person.name === body.name)) {
    return res.status(422).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: idGenerator()
  }

  persons = persons.concat(person)

  res.json(person)
})



app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person) 
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})