import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { meQuery } from '../graphql/queries/me';
import { Query } from 'react-apollo';

import { MeQuery } from '../schemaTypes';
import { HeaderButton } from './HeaderButton';

class Header extends Component {
  state = {};
  render() {
    return (
      <div
        style={{
          height: 50,
          width: '100%',
          backgroundColor: 'rgb(255, 254, 252)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: 10,
          alignItems: 'center',
        }}
      >
        <Link to="/">
          <HeaderButton
            style={{
              fontSize: '24px',
            }}
          >
            Stripe Example
          </HeaderButton>
        </Link>
        <Query<MeQuery> query={meQuery}>
          {({ data, loading }) => {
            if (loading || !data) {
              return <div>Loading...</div>;
            }

            if (!data.me) {
              return (
                <div>
                  <Link to="/login">
                    <HeaderButton>Login</HeaderButton>
                  </Link>
                  <Link to="/register">
                    <HeaderButton>Register</HeaderButton>
                  </Link>
                </div>
              );
            }

            return (
              <Link to="/account">
                <HeaderButton>Account</HeaderButton>
              </Link>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Header;
