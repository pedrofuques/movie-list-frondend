import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MoviesEdit from "./components/MoviesEdit";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path='/:id' exact={true} component={Home} />
          <Route path='/movies/:id' component={MoviesEdit} />
        </Switch>
      </Router>
    );
  }
}

export default App;
