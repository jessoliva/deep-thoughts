import React from 'react';
// This component will change the URL while staying on the same page
import { Link } from 'react-router-dom';
// personalize navigation for logged in users
import Auth from '../../utils/auth';

const Header = () => {
	const logout = event => {

		// With the event.preventDefault(), we're actually overriding the <a> element's default nature of having the browser load a different resource
		event.preventDefault();

		// Instead, we execute the .logout() method, which will remove the token from localStorage and then refresh the application by taking the user back to the homepage
		Auth.logout();
	};

	return (
		<header className="bg-secondary mb-4 py-2 flex-row align-center">
			<div className="container flex-row justify-space-between-lg justify-center align-center">
				{/* Link component uses a to attribute instead of an href attribute */}
				<Link to="/">
				<h1>Deep Thoughts</h1>
				</Link>

				<nav className="text-center">
					{/* depending on the outcome of the Auth.loggedIn(). If it returns true, and we're logged in, we want to display navigation items tailored to the user. If it returns false, we'll display the default items for logging in and signing up. */}
					{Auth.loggedIn() ? (
					<>
						<Link to="/profile">Me</Link>
						<a href="/" onClick={logout}>
						Logout
						</a>
					</>
					) : (
					<>
						<Link to="/login">Login</Link>
						<Link to="/signup">Signup</Link>
					</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
