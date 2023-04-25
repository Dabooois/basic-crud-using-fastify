import fastify from 'fastify';
import postRoute from './routes/posts';

const server = fastify().register(require('@fastify/formbody'));

server.register(postRoute);

server.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
