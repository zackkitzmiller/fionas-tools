import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Todo = props => {

  const markCompletionStatus = (e) => {
    e.preventDefault()
    const obj = {
      todo_description: props.todo.todo_description,
      todo_responsible: props.todo.todo_responsible,
      todo_priority: props.todo.todo_priority,
      todo_completed: !props.todo.todo_completed
    }

    axios.post('http://localhost:4000/todos/update/' + props.todo._id, obj)
      .then(window.location.reload(false))

  }

  return (
    <tr>
      <td className={props.todo.todo_completed ? 'completed' : ''}>
        {props.todo.todo_description}
      </td>
      <td className={props.todo.todo_completed ? 'completed' : ''}>
        {props.todo.todo_responsible}
      </td>
      <td className={props.todo.todo_completed ? 'completed' : ''}>
        {props.todo.todo_priority}
      </td>
      <td>
        <Link to={"/edit/" + props.todo._id}>Edit</Link>
        &nbsp; | &nbsp;
        <Link to={"/mark-status/" + props.todo._id} onClick={markCompletionStatus}>
          {props.todo.todo_completed ? 'Undo' : 'Done'}
        </Link>
        &nbsp; | &nbsp;
        <Link to={"/delete/" + props.todo._id}>Delete</Link>
      </td>
    </tr>
  )
}


export default class TodosList extends Component {

  constructor(props) {
    super(props)
    this.state = {todos: [], focus: false}
  }

  focusModeEnabled() {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('focus')) {
      return true
    }
  }

  componentDidMount() {
    let endpoint = "http://localhost:4000/todos/"
    if (this.focusModeEnabled()) {
      endpoint += "?top=true"
      this.setState({focus: true})
    }
    axios.get(endpoint)
      .then(response => {
        this.setState({ todos: response.data })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  todoList() {
    return this.state.todos.map(function(currentTodo, i) {
      return <Todo todo={currentTodo} key={i} />
    })
  }

  render () {
    return (
      <div>
        <h3>Fiona's Todos  
          <small style={{fontSize: 12 + "px"}}>&nbsp;
            {!this.state.focus ?
            <a href="/?focus=true">focus?</a>
            : <a href="/">full list</a>}
          </small>
        </h3>
        {this.state.todos.length ?
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Responsibility</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { this.todoList() }
          </tbody>
        </table>
        : <p>All Done! Add a <Link to="/create">Todo?</Link></p>}
      </div>
    )
  }
}
