//  run the npm install jsonwebtoken command to add the JWT package to your project
const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;
      
        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
          token = token
            .split(' ')
            .pop()
            .trim();
        }
      
        // if no token, return request object as is
        if (!token) {
            return req;
        }
      
        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            // This is where the secret becomes important. If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(), the object won't be decoded

            req.user = data;
        } catch {
            console.log('Invalid token');
        }
        // When the JWT verification fails, an error is thrown. 
        // We don't want an error thrown on every request, though. Users with an invalid token should still be able to request and see all thoughts. Thus, we wrapped the verify() method in a try...catch statement to mute the error. We'll manually throw an authentication error on the resolver side when the need arises.
      
        // return updated request object
        return req;
    }
    // Now that we've set up the middleware, let's add it to the server in server.js file
};

// signToken() function 
    // expects a user object and will add that user's username, email, and _id properties to the token
    // Optionally, tokens can be given an expiration date and a secret to sign the token with. Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token

// Now that we have a way to generate tokens, we need to update the GraphQL type definitions to include it. A token isn't part of the User model, though, so it doesn't make sense to add it to the User type definition. Instead, we'll create a new type specifically for authentication.