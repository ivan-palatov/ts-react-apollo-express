import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import { userFragment } from '../../graphql/fragments/userFragment';
import { CancelSubscriptionMutation } from '../../schemaTypes';

const cancelSubscriptionMutation = gql`
  mutation CancelSubscriptionMutation {
    cancelSubscription {
      ...UserInfo
    }
  }

  ${userFragment}
`;

class CancelSubscription extends Component {
  state = {};
  render() {
    return (
      <Mutation<CancelSubscriptionMutation> mutation={cancelSubscriptionMutation}>
        {mutate => (
          <button onClick={() => mutate()} className="button is-danger">
            Cancel Subscription
          </button>
        )}
      </Mutation>
    );
  }
}

export default CancelSubscription;
