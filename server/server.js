const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
   typeDefs,
   resolvers
});
// With the new ApolloServer() function, we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// We then connect our Apollo server to our Express.js server.
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
   await server.start();
   // integrate our Apollo server with the Express application as middleware
   server.applyMiddleware({ app });

   db.once('open', () => {
      app.listen(PORT, () => {
         console.log(`API server running on port ${PORT}!`);
         // log where we can go to test our GQL API
         console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      })
   })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);


// This server uses Mongoose for all of its MongoDB data handling, but instead of connecting to the database right from server.js, it's actually handling the connection in the config/connection.js file. From there, the mongoose.connection object is exported.

// In server.js, we import that connection. Then when we run our server, we listen for that connection to be made with db.open(). Upon a successful connection, we start the server.

