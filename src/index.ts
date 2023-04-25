import fastify from 'fastify';
import postRoute from './routes/posts';
import mercurius from 'mercurius';
const server = fastify().register(require('@fastify/formbody'));

server.register(postRoute);

const schema = `
  type Query {
    hello: String
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
    hello: () => {
        return 'Hello world!';
    },
};

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
