import { IPost } from '../types/posts';
import postService from '../services/posts';

const resolvers = {
    getPosts: async () => {
        const { ok, results, message } = await postService.getPosts();
        if (ok) {
            return results;
        }

        return message;
    },
    getPost: async ({ id }) => {
        const { ok, result, message } = await postService.getPost(id);

        if (ok && result) {
            return result;
        }

        return message;
    },

    createPost: async ({ data }) => {
        const { title, body, isPublished } = data as IPost;

        const { message } = await postService.createPost({
            title,
            body,
            isPublished,
        });

        return message;
    },

    updatePost: async ({ data }) => {
        const { id } = data as IPost;
        const { message } = await postService.updatePost(Number(id), {
            ...data,
        });

        return message;
    },

    deletePost: async ({ id }) => {
        const { message } = await postService.deletePost(Number(id));
        return message;
    },
};

export default resolvers;
