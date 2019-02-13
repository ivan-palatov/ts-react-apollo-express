import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { meQuery } from '../../graphql/queries/me';
import { LoginMutationVariables, LoginMutation } from '../../schemaTypes';
import { userFragment } from '../../graphql/fragments/userFragment';

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
          <form
            onSubmit={async e => {
              e.preventDefault();
              await client.resetStore();
              const response = await mutate({ variables: { email, password } });
              this.props.history.push('/account');
            }}
          >
            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="control has-icons-left">
                <input
                  type="email"
                  id="email"
                  className="input"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="control has-icons-left">
                <input
                  type="password"
                  id="password"
                  className="input"
                  placeholder="Enter password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-key" />
                </span>
              </div>
            </div>
            <button className="button is-info">Login</button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Login;
