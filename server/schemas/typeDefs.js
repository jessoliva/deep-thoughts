// Before we can create any resolvers, we need to first create the type definition

// First, import the gql tagged template function from apollo-server-express
// Tagged templates are an advanced use of template literals, and were introduced with ES6 as well
const { gql } = require('apollo-server-express');

// create our typeDefs
// All of our type definitions will go into the typeDefs tagged template function
// With this, we're instructing our query that we'll return an array, as noted by the [] square brackets around the returning data, Thought
// Custom Thought data type: 
    // With this custom data type, we are able to instruct the thoughts query so that each thought that returns can include _id, thoughtText, username, and reactionCount fields with their respective GraphQL scalars. ID is essentially the same as String except that it is looking for a unique identifier; and Int is simply an integer.
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }
`;
// we've now defined our thoughts query that it could receive a parameter if we wanted. In this case, the parameter would be identified as username and would have a String data type
// Keep in mind that the way we set this up will allow us to query thoughts with or without the username parameter
// Now, let's update our resolver function for thoughts to accept this parameter and look up thoughts for a specific user

// Queries are how we perform GET requests and ask for data from a GraphQL API
//  To define a query, you use the type Query {} data type, which is built into GraphQL
//  From there, you can define your different types of queries by naming them, just as you would name a function in JavaScript
// All type definitions need to specify what type of data is expected in return, no matter what
// GraphQL has built-in data types known as scalars
    // Scalars work similarly to how we defined data in Mongoose using JavaScript's built-in types

// export the typeDefs
module.exports = typeDefs;

// type Query {
//     users: [User]
//     user(username: String!): User
//     thoughts(username: String): [Thought]
//     thought(_id: ID!): Thought
// }
    // With this, we now have four queries defined: two for thoughts, and two for users
    // Notice the exclamation point ! after the query parameter data type definitions? That indicates that for that query to be carried out, that data must exist. Otherwise, Apollo will return an error to the client making the request and the query won't even reach the resolver function associated with it
    // Earlier, we didn't enforce a query parameter for thoughts because it wasn't necessary for the query to work. If there's no parameter, we simply return all thoughts. But if we want to look up a single thought or user, we need to know which one we're looking up and thus necessitate a parameter for us to look up that data.

// username: String! --> this means, username is required for the query to be carried out. If it's not included, we'll get an error