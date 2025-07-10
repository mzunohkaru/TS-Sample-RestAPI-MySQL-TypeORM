import { Post } from "../entity/Post";
export declare class PostService {
    private postRepository;
    private userRepository;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: string): Promise<Post>;
    createPost(postData: {
        title: string;
        content: string;
        userId: number;
    }): Promise<Post>;
    updatePost(id: string, updateData: {
        title?: string;
        content?: string;
    }, userId: number): Promise<Post>;
    deletePost(id: string, userId: number): Promise<void>;
}
//# sourceMappingURL=postService.d.ts.map