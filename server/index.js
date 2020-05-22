import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Link{
        _id: Int!
        url: String
        description: String!
    }

    type Query {
        links: [Link!]!
    }
`);
const links =[
    {_id: 0 ,url: 'https://examle.com', description: 'a website' },
    {_id: 1 ,url: 'https://examle1.com', description: 'a website 1' },
]

const root = {
  links: () => links,
};

const app = express();

app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4000, () => console.log('Running a graphql server on localhost:4000/graphql'));