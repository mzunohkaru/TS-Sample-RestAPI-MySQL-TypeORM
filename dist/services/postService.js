"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const data_source_1 = require("../data-source");
const Post_1 = require("../entity/Post");
const User_1 = require("../entity/User");
const error_middleware_1 = require("../middleware/error.middleware");
class PostService {
    constructor() {
        this.postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async getAllPosts() {
        const posts = await this.postRepository.find({
            relations: ["user"],
            order: {
                createdAt: "DESC",
            },
        });
        return posts;
    }
    async getPostById(id) {
        const post = await this.postRepository.findOne({
            where: { id: Number(id) },
            relations: ["user"],
        });
        if (!post) {
            throw new error_middleware_1.CustomError("Post not found", 404);
        }
        return post;
    }
    async createPost(postData) {
        const user = await this.userRepository.findOne({
            where: { id: postData.userId },
        });
        if (!user) {
            throw new error_middleware_1.CustomError("User not found", 404);
        }
        const post = this.postRepository.create({
            title: postData.title,
            content: postData.content,
            userId: postData.userId,
        });
        return await this.postRepository.save(post);
    }
    async updatePost(id, updateData, userId) {
        const post = await this.postRepository.findOne({
            where: { id: Number(id) },
            relations: ["user"],
        });
        if (!post) {
            throw new error_middleware_1.CustomError("Post not found", 404);
        }
        if (post.userId !== userId) {
            throw new error_middleware_1.CustomError("Unauthorized to update this post", 403);
        }
        await this.postRepository.update(Number(id), updateData);
        const updatedPost = await this.postRepository.findOne({
            where: { id: Number(id) },
            relations: ["user"],
        });
        return updatedPost;
    }
    async deletePost(id, userId) {
        const post = await this.postRepository.findOne({
            where: { id: Number(id) },
        });
        if (!post) {
            throw new error_middleware_1.CustomError("Post not found", 404);
        }
        if (post.userId !== userId) {
            throw new error_middleware_1.CustomError("Unauthorized to delete this post", 403);
        }
        await this.postRepository.delete(Number(id));
    }
}
exports.PostService = PostService;
//# sourceMappingURL=postService.js.map