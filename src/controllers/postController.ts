import { Request, Response } from "express";
import { PostService } from "../services/postService";
import { asyncHandler } from "../middleware/error.middleware";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  getAllPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const posts = await this.postService.getAllPosts();
      res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        data: posts,
        count: posts.length,
      });
    },
  );

  getPostById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const post = await this.postService.getPostById(id);
      res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: post,
      });
    },
  );

  createPost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { title, content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const post = await this.postService.createPost({
        title,
        content,
        userId,
      });
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    },
  );

  updatePost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

      const post = await this.postService.updatePost(
        id,
        { title, content },
        userId,
      );
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    },
  );

  deletePost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
    },
  );
}
