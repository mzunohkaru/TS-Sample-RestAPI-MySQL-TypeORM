import { Request, Response } from "express";
export declare class PostController {
    private postService;
    constructor();
    getAllPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPostById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createPost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deletePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=postController.d.ts.map