const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
// middleware to verify and decode JWT, and for authentication checks
const { authMiddleware } = require('./utils/auth');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: authMiddleware
});
// With the new ApolloServer() function, we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests
// context: authMiddleware --> This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context

// 21.3.6 we need to update the back-end server's code to serve up the React front-end code in production
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// We then connect our Apollo server to our Express.js server.
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
   await server.start();
   // integrate our Apollo server with the Express application as middleware
   server.applyMiddleware({ app });

   // Serve up static assets
   if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
   }
   //
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
   });
   // We just added two important pieces of code that will only come into effect when we go into production. First, we check to see if the Node environment is in production. If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder
   // The next set of functionality we created was a wildcard GET route for the server. In other words, if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code.

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

