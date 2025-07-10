import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { CustomError } from "../middleware/error.middleware";

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
    });
    return posts;
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ["user"],
    });

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    return post;
  }

  async createPost(postData: {
    title: string;
    content: string;
    userId: number;
  }): Promise<Post> {
    const user = await this.userRepository.findOne({
      where: { id: postData.userId },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const post = this.postRepository.create({
      title: postData.title,
      content: postData.content,
      userId: postData.userId,
    });

    return await this.postRepository.save(post);
  }

  async updatePost(
    id: string,
    updateData: { title?: string; content?: string },
    userId: number,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ["user"],
    });

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    if (post.userId !== userId) {
      throw new CustomError("Unauthorized to update this post", 403);
    }

    await this.postRepository.update(Number(id), updateData);

    const updatedPost = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ["user"],
    });

    return updatedPost!;
  }

  async deletePost(id: string, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
    });

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    if (post.userId !== userId) {
      throw new CustomError("Unauthorized to delete this post", 403);
    }

    await this.postRepository.delete(Number(id));
  }
}
