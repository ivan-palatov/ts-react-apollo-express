import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { userFragment } from '../../graphql/fragments/userFragment';
import { CreateSubscriptionMutationVariables, CreateSubscriptionMutation } from '../../schemaTypes';

const createSubscriptionMutation = gql`
  mutation CreateSubscriptionMutation($source: String!, $ccLast4: String!) {
    createSubscription(source: $source, ccLast4: $ccLast4) {
      ...UserInfo
    }
  }

  ${userFragment}
`;

class Subscription extends Component {
  render() {
    return (
      <Mutation<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>
        mutation={createSubscriptionMutation}
      >
        {mutate => (
          <StripeCheckout
            token={async token => {
              const response = await mutate({
                variables: { source: token.id, ccLast4: token.card.last4 },
              });
            }}
            stripeKey={process.env.REACT_APP_STRIPE_KEY!}
            name="Subscribe"
            panelLabel="Subscribe"
            amount={1000}
            currency="USD"
            ComponentClass="span"
          >
            <button className="button is-info">Subscribe</button>
          </StripeCheckout>
        )}
      </Mutation>
    );
  }
}

export default Subscription;
