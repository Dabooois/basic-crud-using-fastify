import { IPost, IPostId } from '../type/post';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
const client = new PrismaClient();

const postRoute = async (fastify: FastifyInstance, _options: Object) => {
  fastify.get('/', async function (request, reply) {
    const posts = await client.post.findMany();
    reply.status(200).send({
      data: posts,
    });
  }),
    fastify.post<{ Body: IPost }>('/post/new', async function (request, reply) {
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
    }),
    fastify.get<{ Params: IPostId }>(
      '/posts/:id/edit',
      async (request, reply) => {
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
      }
    ),
    fastify.put<{ Params: IPostId; Body: IPost }>(
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
    ),
    fastify.delete<{ Params: IPostId }>(
      '/posts/:id',
      async (request, reply) => {
        const { id } = request.params;

        await client.post.delete({
          where: {
            id: Number(id),
          },
        });

        reply.status(200).send({
          message: 'Post successfully deleted',
        });
      }
    );
};

export default postRoute;
