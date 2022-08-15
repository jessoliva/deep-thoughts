import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
// This component, Navigate, will allow us to redirect the user to another route within the application. Think of it like how we've used location.replace() in the past, but it leverages React Router's ability to not reload the browser!

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

//  update the logic of the Profile component to know when it's loading the logged-in user's data or another user's data. We'll do this by comparing the value of the username parameter in the URL to the value of the logged-in user with our AuthService functionality.
import Auth from '../utils/auth';

const Profile = () => {

	//  The useParams Hook retrieves the username from the URL, which is then passed to the useQuery Hook
	//  the useParams() Hook we use will have a value if it's another user's profile and won't have a value if it's ours
    const { username: userParam } = useParams();
	// console.log(userParam);
	//
	// update our useQuery() Hook to check the value of our parameter and conditionally run a query based on the result.
	// Now if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. 
	// If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.
	const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
		variables: { username: userParam }
	});
	// when we run QUERY_ME, the response will return with our data in the me property; but if it runs QUERY_USER instead, the response will return with our data in the user property

	// The user object that is created afterwards is used to populate the JSX
	const user = data?.me || data?.user || {};
	// console.log(user);

	// use Navigate component
	// navigate to personal profile page if username is the logged-in user's
	if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
		return <Navigate to="/profile" />;
	}
	// With this, we're checking to see if the user is logged in and if so, if the username stored in the JSON Web Token is the same as the userParam value. If they match, we return the <Navigate> component with the prop to set to the value /profile, which will redirect the user away from this URL and to the /profile route

    if (loading) {
      return <div>Loading...</div>;
    }

	// What happens if you navigate to /profile and you aren't logged in?
	// Now if there is no user data to display, we know that we aren't logged in or at another user's profile page. Instead of redirecting the user away, we simply inform them that they need to be logged in to see this page and they must log in or sign up to use it.
	if (!user?.username) {
		return (
		  <h4>
			You need to be logged in to see this page. Use the navigation links above to sign up or log in!
		  </h4>
		);
	}
	
    return (
		<div>
			<div className="flex-row mb-3">
				<h2 className="bg-dark text-secondary p-3 display-inline-block">
				Viewing {userParam ? `${user.username}'s` : 'your'} profile.
				{/* if userParam is true, display username else display your */}
				</h2>
			</div>

			<div className="flex-row justify-space-between mb-3">
				{/* PRINT THOUGHT LIST */}
				<div className="col-12 mb-3 col-lg-8"> 
					<ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
					{/* passing props to the ThoughtList component to render a list of thoughts unique to this user */}
				</div>
			</div>

			{/* send the necessary data tot the Friendlist component */}
			<div className="col-12 col-lg-3 mb-3">
				<FriendList
				username={user.username}
				friendCount={user.friendCount}
				friends={user.friends}
				/>
			</div>
		</div>
    );
};

export default Profile;
