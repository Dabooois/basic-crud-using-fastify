import { PrismaClient } from '@prisma/client';
import { IPost } from '../types/posts';

const client = new PrismaClient();

const postService = {
  async getPosts(): Promise<{
    ok: boolean;
    results?: IPost[];
    message?: string;
  }> {
    try {
      const results = await client.post.findMany();
      return {
        ok: true,
        results: results,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error in fetching posts',
      };
    }
  },

  async getPost(
    id: number
  ): Promise<{ ok: boolean; result?: IPost | null; message?: string }> {
    try {
      const result = await client.post.findUnique({
        where: {
          id: id,
        },
      });
      return {
        ok: true,
        result: result,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error in fetching this post',
      };
    }
  },

  async createPost({ title, body, isPublished }: IPost): Promise<{
    ok: boolean;
    message: string;
  }> {
    let newIsPublished = false;
    if (typeof isPublished === 'string') {
      newIsPublished = isPublished === 'false' ? false : true;
    } else if (typeof isPublished === 'boolean') {
      newIsPublished = isPublished;
    }

    try {
      await client.post.create({
        data: {
          title,
          body,
          isPublished: newIsPublished,
        },
      });

      return {
        ok: true,
        message: 'Post successfully created',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error in creating post',
      };
    }
  },

  async updatePost(
    id: number,
    { title, body, isPublished }: IPost
  ): Promise<{ ok: boolean; message: string }> {
    let newIsPublished = false;
    if (typeof isPublished === 'string') {
      newIsPublished = isPublished === 'false' ? false : true;
    } else if (typeof isPublished === 'boolean') {
      newIsPublished = isPublished;
    }

    try {
      await client.post.update({
        where: {
          id: id,
        },
        data: {
          title,
          body,
          isPublished: newIsPublished,
        },
      });

      return {
        ok: true,
        message: 'Post Successfully updated',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error in updating post',
      };
    }
  },

  async deletePost(id: number): Promise<{ ok: boolean; message: string }> {
    try {
      await client.post.delete({
        where: {
          id: id,
        },
      });
      return {
        ok: true,
        message: 'Post successfully deleted',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error in deleting post',
      };
    }
  },
};

export default postService;
