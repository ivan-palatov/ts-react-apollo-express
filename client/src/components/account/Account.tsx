import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Redirect } from 'react-router-dom';

import { MeQuery } from '../../schemaTypes';
import Subscription from './Subscription';

const meQuery = gql`
  query MeQuery {
    me {
      id
      email
      type
    }
  }
`;

class Account extends Component {
  state = {};
  render() {
    return (
      <Query<MeQuery> fetchPolicy="network-only" query={meQuery}>
        {({ data, loading }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (!data) {
            return <div>Data is undefined.</div>;
          }
          if (!data.me) {
            return <Redirect to="/login" />;
          }
          if (data.me.type === 'free-trial') {
            return <Subscription />;
          }

          return <Redirect to="paid-users" />;
        }}
      </Query>
    );
  }
}

export default Account;
