import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MoviesEdit from "./components/MoviesEdit";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  state = {
    user: this.props.cookies.get("user") || "",
  };

  handleCookie = () => {
    const { cookies } = this.props;
    cookies.set("user", uuidv4(), { path: "/" }); // setting the cookie
    this.setState({ user: cookies.get("user") });
  };

  componentDidMount() {
    // set a cookie if for a new user
    if (this.state.user === "") {
      this.handleCookie();
    }
  }

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

export default withCookies(App);
