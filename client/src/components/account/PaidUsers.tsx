import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { MeQuery } from '../../schemaTypes';
import Subscription from './Subscription';
import { meQuery } from '../../graphql/queries/me';

const PaidUsers: React.FunctionComponent = () => (
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

      return <div>You are subscribed to our stuff.</div>;
    }}
  </Query>
);

export default PaidUsers;
