import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
// to implement authentication functionality 
import Auth from '../utils/auth';

const Signup = () => {
	const [formState, setFormState] = useState({ username: '', email: '', password: '' });

	// the useMutation() Hook creates and prepares a JavaScript function that wraps around our mutation code and returns it to us. In our case, it returns in the form of the addUser function that's returned. We also get the ability to check for errors.
	const [addUser, { error }] = useMutation(ADD_USER);

	// update state based on form input changes
	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value,
		});
	};
	// functionality for capturing form field data from a user and storing it in state using the useState() Hook from React

	// submit form (notice the async!)
	const handleFormSubmit = async event => {
		event.preventDefault();

		// use try/catch instead of promises to handle errors
		try {
			// execute addUser mutation and pass in variable data from form
			const { data } = await addUser({
				variables: { ...formState }
			});

			// take the token and set it to localStorage
			// to use it to check if user is logged in when other component are going to be used
			Auth.login(data.addUser.token);
			// Now when you sign up successfully, you'll be redirected to the homepage with your token stored in localStorage
			// console.log(data);
		} catch (e) {
			console.error(e);
		}
	};
	// With this updated function, we will now pass the data from the form state object as variables for our addUser mutation function. Upon success, we destructure the data object from the response of our mutation and simply log it to see if we're getting our token
	// We use the try...catch block functionality here, as it is especially useful with asynchronous code such as Promises. This way, we can use async/await instead of .then() and .catch() method-chaining while still being able to handle any errors that may occur

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Sign Up</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
              <input
                className='form-input'
                placeholder='Your username'
                name='username'
                type='username'
                id='username'
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='******'
                name='password'
                type='password'
                id='password'
                value={formState.password}
                onChange={handleChange}
              />
              <button className='btn d-block w-100' type='submit'>
                Submit
              </button>
            </form>
			{error && <div>Sign up failed</div>}
			{/* if there's an error, we'll see a <div> element with a message saying so */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
