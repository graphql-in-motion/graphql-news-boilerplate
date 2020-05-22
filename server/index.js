import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { find} from 'lodash';

const schema = buildSchema(`
    type Link{
        _id: Int! @unique
        url: String!
        description: String!
    }
    type User{
        _id: Int! @unique
        username:String!
        about: String
    }
    type Query {
        allLinks: [Link!]!
        link(id: Int): Link
        allUsers: [User!]!
        user(id: Int!) : User!
    }
`);
const links =[
    {_id: 0 ,url: 'https://sumithpd.com', description: 'my website' },
    {_id: 1 ,url: 'https://examle1.com', description: 'a website 1' },
];
const users =[
    {_id: 0 , username: 'user1', about: 'Super hero user'},
    {_id: 1 , username: 'user2', about: 'Normal user'},
];
const root = {
  allLinks: () => links,
  link: ({ id })=> {
      console.log(id);
    return find(links,{ _id:id  });
  } ,
  allUsers: () => users,
  user: ({ id }) => find(users,{ _id:id }),
};

const app = express();

app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4000, () => console.log('Running a graphql server on localhost:4000/graphql'));