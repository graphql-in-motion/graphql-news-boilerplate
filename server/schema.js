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
    {
        id: 0,
        author: 0,
        url: 'https://Sumithpd.com',
        description: 'My site',
        comments: [0],
        score: 10
    },
    {
        id: 1,
        author: 1,
        url: 'https://google.com',
        description: 'Google site',
        comments: [2, 4],
        score: 5
    },
];

const users = [
    { id: 0, username: 'user1', about: 'user about1' },
    { id: 1, username: 'user2', about: 'user about2' },
];

const commentsList = [
    { id: 0, parent: null, author: 0, content: 'Comment 1' },
    { id: 1, parent: 0, author: 1, content: 'Comment 2' },
    { id: 2, parent: null, author: 0, content: 'Comment 3' },
    { id: 3, parent: 2, author: 1, content: 'Comment 4' },
    { id: 4, parent: null, author: 1, content: 'Comment 5' },
];
function getComments(commentId) {
    const comments = commentsList.filter(comment => comment.parent == commentId);
    if (comments.length > 0) {
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
            resolve: ({ comments }) =>
                comments.map(id => find(commentsList, { id })),
        },
        score: { type: GraphQLNonNull(GraphQLInt) },
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
                id: { type: GraphQLInt },
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
                id: { type: GraphQLInt },
            },
            resolve: (_, { id }) => find(users, { id }),
        },
    }),
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        upvoteLink: {
            type: linkType,
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (_,{ id }) => {
                const link = find(links, { id });
                if (!link) {
                    throw new Error(`could not find link wiht id ${id}`);
                }
                link.score += 1;
                return link;
            }
        },
        downvoteLink: {
            type: linkType,
            args: {
                id: { type:  GraphQLNonNull(GraphQLInt) },
            },
            resolve: (_,{ id }) => {
                const link = find(links, { id });
                if (!link) {
                    throw new Error(`could not find link wiht id ${id}`);
                }
                link.score -= 1;
                return link;
            }
        },
        createLink: {
            type: linkType,
            args: {
              // No empty URLs
              url: { type: new GraphQLNonNull(GraphQLString) },
              description: { type: GraphQLString },
            },
            resolve: async (_, data, { db: { Links }, user }) => {
              const link = Object.assign(
                {
                  author: user && user._id, // The signed in user is our author
                  score: 0,
                  comments: [],
                },
                data
              );         
          
              const response = await Links.insert(link);
          
              return Object.assign({ _id: response.insertedIds[0] }, data);
            },
          }

    })
});
const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

export default schema;