import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// BrowserRouter, Routes, and Route are components that the React Router library provides. We renamed BrowserRouter to Router to make it easier to work with
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

// establish the connection to the back-end server's /graphql endpoint
const httpLink = createHttpLink({
    uri: '/graphql',
});
// URI stands for "Uniform Resource Identifier."
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
// With the preceding code, we first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
// We also instantiate a new cache object using new InMemoryCache()

function App() {
    return (
        // we need to enable our entire application to interact with our Apollo Client instance
        <ApolloProvider client={client}>
            {/* wrapped the <div className="flex-column"> element in a Router component, which makes all of the child components on the page aware of the client-side routing that can take place now */}
            {/* the Router component will always contain within it the Routes component */}
            <Router>
                <div className="flex-column justify-flex-start min-100-vh">
                    <Header />
                    <div className="container">
                        <Routes>
                            <Route
                                path="/"
                                element={<Home />}
                            />
                            <Route
                                path="/login"
                                element={<Login />}
                            />
                            <Route
                                path="/signup"
                                element={<Signup />}
                            />
                            <Route
                                path="/profile/:username"
                                element={<Profile />}
                            />
                            <Route
                                path="/profile/"
                                element={<Profile />}
                            />
                            {/* adding :username? as parameter --> JK!! THE ? NO LONGER WORKS SO DID 2 ROUTES*/}
                            {/* The ? means this parameter is optional, so /profile and /profile/myUsername will both render the Profile component */}
                            <Route
                                path="/thought/:id"
                                element={<SingleThought />}
                            />
                             <Route
                                path="*"
                                element={<NoMatch />}
                            />
                            {/* If the route doesn't match any of the preceding paths (e.g., /about), then users will see the 404 message. */}
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;

// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

// Note how we wrap the entire returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value for the client prop in the provider, everything between the JSX tags will eventually have access to the server's API data through the client we set up.