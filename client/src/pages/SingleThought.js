import React from 'react';
// use to get params to query the database
import { useParams } from 'react-router-dom';
// need these two to handle queries
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import { Link } from 'react-router-dom';

// READ
// had to get rid of ? from :username? in App.js because the updated React Router gets rid of it
const SingleThought = props => {

	// thoughtId is the id of the thought we're trying to get --> the name of that variable can be anything!
	// what matters is the id:
	const { id: thoughtId } = useParams();
	// console.log(thoughtId);

	const { loading, data } = useQuery(QUERY_THOUGHT, {
		variables: { id: thoughtId }
	});
	// 
	const thought = data?.thought || {};
	//
	if (loading) {
		return <div>Loading...</div>;
	}
	// The variables loading and data are destructured from the useQuery Hook
	// The loading variable is then used to briefly show a loading <div> element, and the data variable is used to populate a thought object
	// The useQuery Hook was given a second argument in the form of an object. This is how you can pass variables to queries that need them. The id property on the variables object will become the $id parameter in the GraphQL query in QUERY_THOUGHT in queries.js

	return (
		<div>
			<div className="card mb-3">
				<p className="card-header">
					{/* <span style={{ fontWeight: 700 }} className="text-light"> */}
					<Link
						to={`/profile/${thought.username}`}
						style={{ fontWeight: 700 }}
						className="text-light"
					>
						{thought.username}
					</Link>{' '}
					thought on {thought.createdAt}
				</p>
				<div className="card-body">
					<p>{thought.thoughtText}</p>
				</div>
			</div>
			{thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
			{/* ReactionList component passing in the reactions array as a prop */}
			{/* We combined this with a thought.reactionCount > 0 expression to prevent rendering the reactions if the array is empty. */}
		</div>
	);
};

export default SingleThought;
