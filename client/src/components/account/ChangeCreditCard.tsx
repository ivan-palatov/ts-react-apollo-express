import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { userFragment } from '../../graphql/fragments/userFragment';
import { ChangeCreditCardMutation, ChangeCreditCardMutationVariables } from '../../schemaTypes';

const changeCreditCardMutation = gql`
  mutation ChangeCreditCardMutation($source: String!, $ccLast4: String!) {
    changeCreditCard(source: $source, ccLast4: $ccLast4) {
      ...UserInfo
    }
  }

  ${userFragment}
`;

const ChangeCreditCard: React.FunctionComponent = () => (
  <Mutation<ChangeCreditCardMutation, ChangeCreditCardMutationVariables>
    mutation={changeCreditCardMutation}
  >
    {mutate => (
      <>
        <StripeCheckout
          token={async token => {
            const response = await mutate({
              variables: { source: token.id, ccLast4: token.card.last4 },
            });
          }}
          stripeKey={process.env.REACT_APP_STRIPE_KEY!}
          name="Change Credit Card"
          panelLabel="Change Card"
          ComponentClass="span"
        >
          <button className="button is-info">Change Credit Card</button>
        </StripeCheckout>
      </>
    )}
  </Mutation>
);

export default ChangeCreditCard;
