import postService from '../services/posts';

const resolvers = {
    Query: {
        getPosts: async (_, obj) => {
            const { ok, results, message } = await postService.getPosts();
            if (ok) {
                return results;
            }

            return message;
        },
        getPost: async (_, obj) => {},
    },
};

export default resolvers;
