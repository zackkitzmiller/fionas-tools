import React, { Component } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../lib/configuration'

export default class DeleteTodo extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      todo_description: '',
      todo_responsible: '',
      todo_priority: '',
      todo_completed: false
    }
  }

  componentDidMount() {
    axios.get(API_BASE_URL + '/todos/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          todo_description: response.data.todo_description,
          todo_responsible: response.data.todo_responsible,
          todo_priority: response.data.todo_priority,
          todo_completed: response.data.todo_completed
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  onSubmit(e) {
    e.preventDefault()
    
    axios.post(API_BASE_URL + '/todos/delete/' + this.props.match.params.id)
      .then(res => console.log(res.data))

    window.location.reload(true)
  }

  render() {
    return(
      <div>
        <h3 align="center">Delete Todo</h3>
        <p>Are you sure you want to delete the following todo:</p>
        <ul>
          <li>Description: <strong>{this.state.todo_description}</strong></li>
          <li>Repsonsible: <strong>{this.state.todo_responsible}</strong></li>
          <li>Priority: <strong>{this.state.todo_priority}</strong></li>
          <li>Completed: <strong>{this.state.todo_completed ? 'Yes' : 'No'}</strong></li>
        </ul>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input type="submit" value="Delete Todo" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}
