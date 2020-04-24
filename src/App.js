import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"

import CreateTodo from "./components/create-todo.component"
import EditTodo from "./components/edit-todo.component"
import TodosList from "./components/todos-list.component"
import DeleteTodo from "./components/delete-todo.component"

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="http://z19r.com"><span role="img">📖</span></a>
            <Link to="/" className="navbar-brand">Fiona's At-Home Learning Todos</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Todos</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={TodosList} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/delete/:id" component={DeleteTodo} />
          <Route path="/create" component={CreateTodo} />
        </div>
      </Router>
    );
  }
}

export default App;
