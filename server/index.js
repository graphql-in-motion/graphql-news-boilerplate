import express from 'express'
import graphqlHTTP from 'express-graphql'

import schema  from './schema';

const app = express();
const graphqlHTTPOptions = {
  schema,
  graphiql: true,
};
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions));
app.listen(4000, () => console.log('🏃‍♂️ server is running on port 4000'));