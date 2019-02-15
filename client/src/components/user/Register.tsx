import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RegisterMutationVariables, RegisterMutation } from '../../schemaTypes';
import { RouteComponentProps } from 'react-router-dom';
import { RedButton } from '../../shared/RedButton';
import Input from '../../shared/Input';

const registerMutation = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

class Register extends Component<RouteComponentProps<{}>> {
  state = {
    email: '',
    password: '',
  };

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  render() {
    const { email, password } = this.state;
    return (
      <Mutation<RegisterMutation, RegisterMutationVariables> mutation={registerMutation}>
        {mutate => (
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
                onChange={this.handleChange.bind(this)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password..."
                name="password"
                value={password}
                onChange={this.handleChange.bind(this)}
              />
              <RedButton
                onClick={async () => {
                  const response = await mutate({ variables: { email, password } });
                  this.props.history.push('/login');
                }}
              >
                Register
              </RedButton>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Register;
