if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Person = require('./models/person')
app.use(bodyParser.json())


if(process.env.NODE_ENV === 'development'){
  const morgan = require('morgan')
  morgan.token('body', (req) => (JSON.stringify(req.body)))
  app.use(morgan(':method :url :status :res[content-length] - :response-time'
+ ' ms :body'))
}


const cors = require('cors')
app.use(cors())
app.use(express.static('build'))



app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people.map(p => p.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        return response.json(person)
      } else {
        return response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count =>
    {
      response.send(`<p>Puhelinluettelossa ${count} henkilön tiedot</p>` +
            `<p>${new Date()}</p>`)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(deleted => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const newPerson = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(updatedPerson => response.json(updatedPerson.toJSON()))
    .catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
  const name = request.body.name

  const number = request.body.number
  if(!number){
    return response.status(400).json({
      error: 'note must have number'
    })
  }

  if(!name){
    return response.status(400).json({
      error: 'note must have name'
    })
  }

  const newPerson = new Person({
    name: name,
    number: number,
  })

  newPerson.save()
    .then(added => {
      response.json(added.toJSON())
    })
    .catch(error => next(error))
})

const ownErrorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }
  next(error)

}

app.use(ownErrorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listeting to port number ${PORT}`)
})
