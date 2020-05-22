import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query{
        hello: String
    }
`);

const root ={
    hello: ()=> 'Hello, World!',
};

const app =express();
app.use('/graphql',graphqlHTTP({schema,rootvalue:root,graphiql:true}));

app.listen(4000,()=> console.log('Running a graphql server on localhost:4000/graphql'));