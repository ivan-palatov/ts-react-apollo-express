import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { RegisterMutationVariables, RegisterMutation } from "../../schemaTypes";
import { RouteComponentProps } from "react-router-dom";

const registerMutation = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

class Register extends Component<RouteComponentProps<{}>> {
  state = {
    email: "",
    password: ""
  };

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  render() {
    const { email, password } = this.state;
    return (
      <Mutation<RegisterMutation, RegisterMutationVariables> mutation={registerMutation}>
        {mutate => (
          <form
            onSubmit={async e => {
              e.preventDefault();
              const response = await mutate({ variables: { email, password } });
              this.props.history.push("/login");
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
                  onChange={this.handleChange.bind(this)}
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
                  onChange={this.handleChange.bind(this)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-key" />
                </span>
              </div>
            </div>
            <button className="button is-info">Register</button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Register;
