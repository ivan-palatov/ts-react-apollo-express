import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { MeQuery } from '../../schemaTypes';
import Subscription from './Subscription';
import { meQuery } from '../../graphql/queries/me';
import ChangeCreditCard from './ChangeCreditCard';

class Account extends Component {
  state = {};
  render() {
    return (
      <Query<MeQuery> query={meQuery}>
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
          return (
            <div>
              <h3 className="has-text-centered subtitle">You are subscribed to our stuff.</h3>
              <p className="has-text-centered">{data.me.ccLast4 ? `Current credit card number: ${data.me.ccLast4}` : 'We dont know your card number.'}</p>
              <ChangeCreditCard />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Account;
