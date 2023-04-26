import http from 'http';
import url from 'url';
import rootValue from './resolvers/posts';

import { buildSchema, graphql } from 'graphql';
const schema = buildSchema(`
  
  type Query {
    getPosts: [Post]!
    getPost(id: ID!): Post 
  }

  type Mutation {
    createPost(data:CreatePostInput!): String!
    updatePost(data: CreatePostInput ): String!
    deletePost(id:ID!): String!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean!
    createdAt: String!
  }

  input CreatePostInput {
    id: ID
    title: String!
    body: String!
    isPublished: Boolean!
  }
`);

http.createServer(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        Accept: 'application/json',
    });

    const query = url.parse(req.url as string, true).query;
    const method = query.method as string;

    if (req.method === 'POST') {
        req.on('data', async function (data) {
            const source = JSON.parse(data.toString()).query;
            const variable = JSON.parse(data.toString()).variables;

            await graphql({
                schema,
                source: source,
                rootValue,
                variableValues: variable,
            }).then((response) => {
                res.write(JSON.stringify(response));
            });

            res.end();
        });
    } else if (req.method === 'GET') {
        graphql({
            schema,
            source: ` { ${method} }`,
            rootValue,
        }).then((response) => {
            res.write(JSON.stringify(response));
        });

        res.end();
    }
}).listen(8080);

// import fastify from 'fastify';
// import postRoute from './routes/posts';
// import mercurius from 'mercurius';
// import resolvers from './resolvers/posts';

// var { buildSchema, graphql } = require('graphql');

// const server = fastify().register(require('@fastify/formbody'));

// server.register(postRoute);

// server.register(gql, {
//     schema,
//     resolvers: rootValue,
//     graphiql: true,
// });

// server.get(
//     '/graphql',
//     graphql({
//         schema,
//         source: '{ hello }',
//         rootValue,
//     }).then((response) => {
//         console.log(JSON.stringify(response));
//     })
// );

// server.post<{ Body: { method: string } }>(
//     '/graphql',
//     async function (request, reply) {
//         const { method } = request.body;
//         graphql({
//             schema,
//             source: `{ ${method} }`,
//             rootValue,
//         }).then((response) => {
//             console.log(JSON.stringify(response));
//             return JSON.stringify(response);
//         });
//     }
// );

// server.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log(`Server listening at ${address}`);
// });
