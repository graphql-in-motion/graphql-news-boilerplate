import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Link{
        _id: Int!
        url: String
        description: String!
    }
    type User{
        _id: Int!,
        username:String!
    }
    type Query {
        allLinks: [Link!]!
        link(_id: Int): Link!
        allUsers: [User!]!
        user(_id: Int) : User!
    }
`);
const links =[
    {_id: 0 ,url: 'https://sumithpd.com', description: 'my website' },
    {_id: 1 ,url: 'https://examle1.com', description: 'a website 1' },
];
const users =[
    {_id: 0 , username: 'user1'},
    {_id: 1 , username: 'user2'},
];
const root = {
  allLinks: () => links,
  link: ({_id}) => links.filter(i=> i._id === _id)[0],
  allUsers: () => users,
  user: ({_id}) => users.filter(u=> u._id === _id)[0],
};

const app = express();

app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4000, () => console.log('Running a graphql server on localhost:4000/graphql'));