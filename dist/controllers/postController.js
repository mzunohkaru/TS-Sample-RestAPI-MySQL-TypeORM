"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const postService_1 = require("../services/postService");
const error_middleware_1 = require("../middleware/error.middleware");
class PostController {
    constructor() {
        this.getAllPosts = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const posts = await this.postService.getAllPosts();
            res.status(200).json({
                success: true,
                message: "Posts retrieved successfully",
                data: posts,
                count: posts.length,
            });
        });
        this.getPostById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const post = await this.postService.getPostById(id);
            res.status(200).json({
                success: true,
                message: "Post retrieved successfully",
                data: post,
            });
        });
        this.createPost = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const { title, content } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
                return;
            }
            const post = await this.postService.createPost({ title, content, userId });
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: post,
            });
        });
        this.updatePost = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const { title, content } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
                return;
            }
            const post = await this.postService.updatePost(id, { title, content }, userId);
            res.status(200).json({
                success: true,
                message: "Post updated successfully",
                data: post,
            });
        });
        this.deletePost = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
                return;
            }
            await this.postService.deletePost(id, userId);
            res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });
        });
        this.postService = new postService_1.PostService();
    }
}
exports.PostController = PostController;
//# sourceMappingURL=postController.js.map