import React from 'react';
//  importing the useQuery Hook from Apollo Client
// This will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js 
import { useQuery } from '@apollo/client';
// imported the QUERY_THOUGHTS query from the queries.js file
// QUERY_ME_BASIC --> to display logged in users friend list on the side
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// to check if the user is logged in
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

const Home = () => {
    // use useQuery hook to make query request
    const { loading, data } = useQuery(QUERY_THOUGHTS);
    // When we load the Home component in the application, we'll execute the query for the thought data. Because this is asynchronous, just like using fetch(), Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet
    // When it's finished and we have data returned from the server, that information is stored in the destructured data property.

    // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
    // when the component function runs, we execute the QUERY_ME_BASIC query to retrieve the logged-in user's friend list to be printed
    // Now if the user is logged in and has a valid token, userData will hold all of the returned information from our query.
    const { data: userData } = useQuery(QUERY_ME_BASIC);

    // Optional chaining negates the need to check if an object even exists before accessing its properties. In this case, no data will exist until the query to the server is finished. So if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
    // What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
    const thoughts = data?.thoughts || [];
    // console.log(thoughts);

    // to check if user is logged in
    // If you're logged in, the loggedIn variable will be true; otherwise, it will be false
    const loggedIn = Auth.loggedIn();

    return (
        <main>
            <div className='flex-row justify-space-between'>
                {/*  If the user isn't logged in, it'll span the full width of the row. But if you the user is logged in, it'll only span eight columns, leaving space for a four-column <div> on the righthand side */}
                <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
                    )}
                    {/* With this, we use a ternary operator to conditionally render the <ThoughtList> component. If the query hasn't completed and loading is still defined, we display a message to indicate just that. Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props. */}
                </div>
                {/* if the value of loggedIn is true and there is data in the userData variable we created from the useQuery() Hook, we'll render a righthand column <div> that holds our <FriendList> component */}
                {loggedIn && userData ? (
                    <div className="col-12 col-lg-3 mb-3">
                        <FriendList
                        username={userData.me.username}
                        friendCount={userData.me.friendCount}
                        friends={userData.me.friends}
                        />
                    </div>
                ) : null}
            </div>
        </main>
    );
};

export default Home;
