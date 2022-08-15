// This file will store all of the GraphQL query requests

import { gql } from '@apollo/client';

// homepage query
export const QUERY_THOUGHTS = gql`
    query thoughts($username: String) {
        thoughts(username: $username) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
                createdAt
                username
                reactionBody
            }
        }
    }
`;
// We've used similar syntax from the test query we wrote using the Apollo Studio Explorer earlier. Now we've wrapped the entire query code in a tagged template literal using the imported gql function. We've also saved it as QUERY_THOUGHTS and exported it using the ES6 module export syntax
// And just like that, we can import this query function by name and use it anywhere we need throughout the front end of the application.

// to display a single thought in singlethought.js page
export const QUERY_THOUGHT = gql`
    query thought($id: ID!) {
        thought(_id: $id) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
                createdAt
                username
                reactionBody
            }
        }
    }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
      user(username: $username) {
          _id
          username
          email
          friendCount
          friends {
              _id
              username
          }
          thoughts {
              _id
              thoughtText
              createdAt
              reactionCount
          }
      }
  }
`;

// to display info of logged in user in profile.js page
// With this query, we're going to retrieve essentially all data related to the logged-in user. We'll retrieve their user information, thoughts, reactions to those thoughts, and friend list. This one will be great for the user's personal profile page
// With this query, we're requesting significantly less data to be returned over HTTP
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

// for the homepage
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;