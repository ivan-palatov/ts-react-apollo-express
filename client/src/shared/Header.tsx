import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { meQuery } from '../graphql/queries/me';
import { Query } from 'react-apollo';

import { MeQuery } from '../schemaTypes';

class Header extends Component {
  state = {};
  render() {
    return (
      <div
        style={{
          height: 50,
          width: '100%',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'space-around',
          padding: 10,
        }}
      >
        <Link to="/">
          <h2 className="title">Stripe Example</h2>
        </Link>
        <Query<MeQuery> query={meQuery}>
          {({ data, loading }) => {
            if (loading || !data) {
              return <div>Loading...</div>;
            }

            if (!data.me) {
              return (
                <>
                  <div>
                    <Link to="/login">Login</Link>
                  </div>
                  <div>
                    <Link to="/register">Register</Link>
                  </div>
                </>
              );
            }

            return (
              <div>
                <Link to="/account">Account</Link>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Header;
