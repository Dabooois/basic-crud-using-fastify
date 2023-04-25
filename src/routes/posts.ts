import { IPost, IPostId } from '../types/posts';
import { FastifyInstance } from 'fastify';
import postService from '../services/posts';

const postRoute = async (fastify: FastifyInstance, _options: Object) => {
    fastify.get('/', async function (_request, reply) {
        const { ok, results, message } = await postService.getPosts();
        if (ok) {
            reply.status(200).send({
                results,
            });
        }
        reply.status(400).send({
            message,
        });
    }),
        fastify.post<{ Body: IPost }>(
            '/post/new',
            async function (request, reply) {
                const { ok, message } = await postService.createPost({
                    ...request.body,
                });
                if (ok) {
                    reply.status(200).send({
                        message,
                    });
                }
                reply.status(400).send({
                    message,
                });
            }
        ),
        fastify.get<{ Params: IPostId }>(
            '/posts/:id/edit',
            async (request, reply) => {
                const { id } = request.params;

                const { ok, result, message } = await postService.getPost(
                    Number(id)
                );

                if (ok) {
                    reply.status(200).send({
                        result,
                    });
                }
                reply.status(400).send({
                    message,
                });
            }
        ),
        fastify.put<{ Params: IPostId; Body: IPost }>(
            '/posts/:id',
            async (request, reply) => {
                const { id } = request.params;

                const { ok, message } = await postService.updatePost(
                    Number(id),
                    {
                        ...request.body,
                    }
                );

                if (ok) {
                    reply.status(200).send({
                        message,
                    });
                }
                reply.status(400).send({
                    message,
                });
            }
        ),
        fastify.delete<{ Params: IPostId }>(
            '/posts/:id',
            async (request, reply) => {
                const { id } = request.params;
                const { ok, message } = await postService.deletePost(
                    Number(id)
                );

                if (ok) {
                    reply.status(200).send({
                        message,
                    });
                }
                reply.status(400).send({
                    message,
                });
            }
        );
};

export default postRoute;
