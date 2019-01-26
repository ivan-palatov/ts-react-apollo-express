import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { MeQuery } from "../../schemaTypes";

const meQuery = gql`
  query MeQuery {
    me {
      id
      email
    }
  }
`;

class Me extends Component {
  state = {};
  render() {
    return (
      <Query<MeQuery> query={meQuery}>
        {({ data, loading }) => {
          if (loading) {
            return null;
          }
          if (!data) {
            return <div>Data is undefined.</div>;
          }
          if (!data.me) {
            return <div>You are not authorized.</div>;
          }
          return <div>{data.me.email}</div>;
        }}
      </Query>
    );
  }
}

export default Me;
