// serves as the file to collect the other two files (resolvers.js and typeDefs.js) and export them

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers };