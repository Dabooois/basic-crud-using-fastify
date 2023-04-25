import fastify from 'fastify';
import postRoute from './routes/posts';
import mercurius from 'mercurius';
import resolvers from './resolvers/posts';
const server = fastify().register(require('@fastify/formbody'));

server.register(postRoute);

const schema = `
  type Query {
    getPosts: [Post]!
    getPost(id: ID!): Post!
  }
  type Mutation {
    createPost(data:CreatePostInput!): Post!
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
`;

// The root provides a resolver function for each API endpoint

server.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
});

server.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
