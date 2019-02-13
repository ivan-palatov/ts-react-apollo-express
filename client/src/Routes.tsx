import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './components/user/Login';
import Register from './components/user/Register';
import App from './App';
import Account from './components/account/Account';
import PaidUsers from './components/account/PaidUsers';
import Header from './shared/Header';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route
            path="/"
            render={() => (
              <>
                <Header />
                <Route path="/" exact component={App} />
                <Route path="/register" component={Register} />
                <Route path="/account" component={Account} />
                <Route path="/paid-users" component={PaidUsers} />
              </>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
