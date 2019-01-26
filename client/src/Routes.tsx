import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Me from "./components/user/Me";
import App from "./App";
import Subscription from "./components/account/Subscription";

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/me" component={Me} />
          <Route path="/subscription" component={Subscription} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
