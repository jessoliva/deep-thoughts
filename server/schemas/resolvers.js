const { User, Thought } = require('../models');

// Now that we have our query set up, we need to set up the resolver that will serve the response for the set up queries
const resolvers = {
    Query: {
        // Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. We use a ternary operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object
        // We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        thought: async (parent, { _id }) => {
            // destructure the _id argument value and place it into our .findOne() method to look up a single thought by its _id
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends') // associated data
            .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends') // associated data
            .populate('thoughts');
        },
    }
};
// a simple object called resolvers with a Query nested object that holds a series of methods
// These methods get the same name of the query or mutation they are resolvers for. This way, when we use the query helloWorld, this helloWorld() method will execute and return the string "Hello world!".

// Now when we query thoughts, we will perform a .find() method on the Thought model. We're also returning the thought data in descending order, as can be seen in the .sort() method that we chained onto it. We don't have to worry about error handling here because Apollo can infer if something goes wrong and will respond for us.
  
module.exports = resolvers;

// Again, this is a great feature of GraphQL. We have a single function that will return every single piece of data associated with a user, but none of it will be returned unless we explicitly list those fields when we perform our queries.

