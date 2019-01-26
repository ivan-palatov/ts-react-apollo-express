import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { CreateSubscriptionMutationVariables, CreateSubscriptionMutation } from "../../schemaTypes";

const createSubscriptionMutation = gql`
  mutation CreateSubscriptionMutation($source: String!) {
    createSubscription(source: $source) {
      id
      email
    }
  }
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
              const response = await mutate({ variables: { source: token.id } });
              console.log(response);
            }}
            stripeKey={process.env.REACT_APP_STRIPE_KEY!}
          />
        )}
      </Mutation>
    );
  }
}

export default Subscription;
