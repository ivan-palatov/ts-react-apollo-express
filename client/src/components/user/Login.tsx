import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { meQuery } from '../../graphql/queries/me';
import { LoginMutationVariables, LoginMutation } from '../../schemaTypes';
import { userFragment } from '../../graphql/fragments/userFragment';
import { RedButton } from '../../shared/RedButton';
import Input from '../../shared/Input';

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ...UserInfo
    }
  }

  ${userFragment}
`;

class Login extends Component<RouteComponentProps<{}>> {
  state = {
    email: '',
    password: '',
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  render() {
    const { email, password } = this.state;
    return (
      <Mutation<LoginMutation, LoginMutationVariables>
        update={(cache, { data }) => {
          if (!data || !data.login) {
            return;
          }
          cache.writeQuery({
            query: meQuery,
            data: { me: data.login },
          });
        }}
        mutation={loginMutation}
      >
        {(mutate, { client }) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>
              <Input
                label="E-mail"
                type="email"
                placeholder="Enter your email address..."
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password..."
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <RedButton
                onClick={async () => {
                  await client.resetStore();
                  const response = await mutate({ variables: { email, password } });
                  this.props.history.push('/account');
                }}
              >
                Login
              </RedButton>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Login;
