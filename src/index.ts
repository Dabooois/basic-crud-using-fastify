import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { IPost, IPostId } from './type/post';

const server = fastify().register(require('@fastify/formbody'));

const client = new PrismaClient();

server.get('/', async (request, reply) => {
  const posts = await client.post.findMany();
  reply.status(200).send({
    data: posts,
  });
});

server.post<{ Body: IPost }>('/post/new', async (request, reply) => {
  const { title, body, isPublished } = request.body;
  const convertToBoolean = isPublished === 'false' ? false : true;

  await client.post.create({
    data: {
      title,
      body,
      isPublished: convertToBoolean,
    },
  });

  reply.status(200).send({
    message: 'Post successfully created',
  });
});

server.get<{ Params: IPostId }>('/posts/:id/edit', async (request, reply) => {
  const { id } = request.params;

  try {
    const result = await client.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    reply.status(200).send({
      data: result,
    });
  } catch (error) {
    reply.status(400).send({
      message: 'Error in updating post',
    });
  }
});

server.put<{ Params: IPostId; Body: IPost }>(
  '/posts/:id',
  async (request, reply) => {
    const { id } = request.params;
    const { title, body, isPublished } = request.body;
    const convertToBoolean = isPublished === 'false' ? false : true;

    await client.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        body,
        isPublished: convertToBoolean,
      },
    });

    reply.status(200).send({
      message: 'Post Successfully updated',
    });
  }
);

server.delete<{ Params: IPostId }>('/posts/:id', async (request, reply) => {
  const { id } = request.params;

  await client.post.delete({
    where: {
      id: Number(id),
    },
  });

  reply.status(200).send({
    message: 'Post successfully deleted',
  });
});

server.listen({ port: 8080, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
