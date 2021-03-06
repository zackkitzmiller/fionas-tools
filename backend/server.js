const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const todoRoutes = express.Router()
const url = require('url')
const PORT = process.env.PORT || 4000

const { MONGO_DSN } = require('./lib/configuration')
let Todo = require('./models/todo.model')

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(MONGO_DSN, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false 
})
const connection = mongoose.connection

connection.once('open', function() {
  console.log("MongoDB connection established")
})

function topTodo(todos) {
  const incomplete = todos.filter(todo => todo.todo_completed == false)
  const highs = incomplete.filter(todo => todo.todo_priority === 'High')
  const meds = incomplete.filter(todo => todo.todo_priority === 'Medium')
  const lows = incomplete.filter(todo => todo.todo_priority === 'Low')
  let resp = []
  if (highs.length) {
    resp = highs[0]
  } else if (meds.length) {
    resp = meds[0]
  } else if (lows.length) {
    resp = lows[0]
  }
  return [resp]
}

todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err)
    } else {
      const queryObject = url.parse(req.url, true).query
      if (queryObject['top']) {
        todos = topTodo(todos)
      }
      res.json(todos)
    }
  })
})

todoRoutes.options(cors())
todoRoutes.route('/top').get(function(req, res) {
  Todo.find(function(err, todos) {
    res.json(topTodo(todos))
  })
})

todoRoutes.route('/complete').get(function(req, res) {
  Todo.find({todo_completed: true}, function(err, todos) {
    res.json(todos)
  })
})

todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id
  Todo.findById(id, function(err, todo) {
    res.json(todo)
  })
})

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body)
  todo.save()
    .then(todo => {
      res.status(200).json({'todo': 'Added for the Fina'})
    })
    .catch(err => {
      res.status(400).send('uh oh, stinky 💩. Something Broke')
    })
})

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) {
      res.status(404).send('uh oh, stinky 💩. Somethings missing')
    } else {
      todo.todo_description = req.body.todo_description
      todo.todo_responsible = req.body.todo_responsible
      todo.todo_priority = req.body.todo_priority
      todo.todo_completed = req.body.todo_completed
  
      todo.save().then(todo => {
        res.json('Nailed It')
      })
      .catch(err => {
        res.status(400).send('uh oh, stinky 💩. Something Broke')
      })
    }
  })
})

todoRoutes.route('/delete/:id').post(function(req, res) {
  Todo.findByIdAndRemove(req.params.id, function(err, todo) {
    if (err) {
      console.log(err)
      res.status(400).send('oh no')
    } else {
      res.json('baweeted')
    }
  })
})

app.use('/todos', todoRoutes)

app.listen(PORT, function() {
  console.log("Server is listening on port: " + PORT)
})
