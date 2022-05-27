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