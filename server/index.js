import express from 'express'
import graphqlHTTP from 'express-graphql'
// import { buildSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import find from 'lodash/find'
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';
 

const links = [
  { id: 0, author: 0, url: 'https://Sumithpd.com', description: 'My site' ,comments:[0] },
  { id: 1, author: 1, url: 'https://google.com', description: 'Google site',comments:[2,4] },
];

const users = [
  { id: 0, username: 'user1', about: 'user about1' },
  { id: 1, username: 'user2', about: 'user about2' },
];

const commentsList = [
  { id: 0, parent: null, author: 0,content: 'Comment 1' },
  { id: 1, parent: 0, author: 1,content: 'Comment 2' },
  { id: 2, parent: null, author: 0,content: 'Comment 3' },
  { id: 3, parent: 2, author: 1,content: 'Comment 4' },
  { id: 4, parent: null, author: 1,content: 'Comment 5' },
];
function getComments(commentId){
  const comments = commentsList.filter(comment=> comment.parent == commentId);
  if(comments.length >0){
    return comments;
  }
  return null;
} 
const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    about: { type: GraphQLString },
  }),
})

const commentsType = new GraphQLObjectType({
  name: 'Comments',
  fields: () => ({
    id: { type: GraphQLInt },
    parent: { type: commentsType },
    comments: {
      type: new GraphQLList(commentsType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve: ({ id }) => getComments(id),
    },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLInt },
      },
      resolve: ({ author }) => find(users, { id: author }),
    },
    content: {
      type: GraphQLString,
    },
  }),
})

const linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    id: { type: GraphQLInt },
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLInt },
      },
      resolve: ({ author }) => find(users, { id: author }),
    },
    comments: {
      type: new GraphQLList(commentsType),
      resolve: ( { comments }) =>
        comments.map(id => find(commentsList, { id })),
    },
  }),
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    allLinks: {
      type: new GraphQLList(linkType),
      resolve: () => links,
    },
    link: {
      type: linkType,
      args: {
        id:{type: GraphQLInt},
      },
      resolve: (_, { id }) => find(links, { id }),
    },
    allUsers: {
      type: new GraphQLList(userType),
      resolve: () => users,
    },
    user: {
      type: userType,
      args: {
        id:{type: GraphQLInt},
      },
      resolve: (_, { id }) => find(users, { id }),
    },
  }),
});

const schema = new GraphQLSchema({query: queryType});

const app = express();
const graphqlHTTPOptions = {
  schema,
  graphiql: true,
};
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions));
app.listen(4000, () => console.log('🏃‍♂️ server is running on port 4000'));