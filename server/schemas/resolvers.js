const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

// first, import the signToken() function
const { signToken } = require('../utils/auth');
// Next, update the two mutation resolvers to sign a token and return an object that combines the token with the user's data

// Now that we have our query set up, we need to set up the resolver that will serve the response for the set up queries
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // check for the existence of context.user
            // If no context.user property exists, then we know that the user isn't authenticated and we can throw an AuthenticationError
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in');
        },                                                                                   
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };          
        },
        addThought: async (parent, args, context) => {

            // Only logged-in users should be able to use this mutation, hence why we check for the existence of context.user first
            // Remember, the decoded JWT is only added to context if the verification passes
            // The token includes the user's username, email, and _id properties, which become properties of context.user and can be used in the follow-up Thought.create() and User.findByIdAndUpdate() methods
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });
            
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
                // without the { new: true } flag in User.findByIdAndUpdate(), Mongo would return the original document instead of the updated document.
            
                return thought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {

            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );
                // Reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator to add a new reaction to the array
                // Because you're updating an existing thought, the client will need to provide the corresponding thoughtId
            
                return updatedThought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            // This mutation will look for an incoming friendId and add that to the current user's friends array
            // A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent duplicate entries

            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');
            
                return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        }          
    },
};
// a simple object called resolvers with a Query nested object that holds a series of methods
// These methods get the same name of the query or mutation they are resolvers for. This way, when we use the query helloWorld, this helloWorld() method will execute and return the string "Hello world!".

// Now when we query thoughts, we will perform a .find() method on the Thought model. We're also returning the thought data in descending order, as can be seen in the .sort() method that we chained onto it. We don't have to worry about error handling here because Apollo can infer if something goes wrong and will respond for us.
  
module.exports = resolvers;

// Again, this is a great feature of GraphQL. We have a single function that will return every single piece of data associated with a user, but none of it will be returned unless we explicitly list those fields when we perform our queries.

// MUTATION: addUser
    // This mutation will take in the username, email, and password arguments and create a new user in our database. We'll use the .create() method on the User model to create a new user.
    // Here, the Mongoose User model creates a new user in the database with whatever is passed in as the args
    // username, password, and email will become properties on the args object when the resolver on the back end receives it. --> from the mutation code in the query pane