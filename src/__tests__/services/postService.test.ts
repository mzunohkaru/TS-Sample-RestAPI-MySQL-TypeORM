import { PostService } from "../../services/postService";
import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { testDataSource } from "../setup";
import { PasswordUtil } from "../../utils/password.util";
import { CustomError } from "../../middleware/error.middleware";
import { Repository } from "typeorm";
import {
  testUserData,
  anotherUserData,
  postTestData,
  testConstants,
  createBulkPosts,
  errorMessages,
} from "../fixtures/postService.fixtures";

describe("PostService", () => {
  let postService: PostService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;
  let testUser: User;
  let anotherUser: User;

  beforeAll(() => {
    Object.defineProperty(require("../../data-source"), "AppDataSource", {
      value: testDataSource,
      writable: false,
    });
  });

  beforeEach(async () => {
    postService = new PostService();
    postRepository = testDataSource.getRepository(Post);
    userRepository = testDataSource.getRepository(User);

    testUser = await userRepository.save({
      ...testUserData,
      password: await PasswordUtil.hashPassword(testUserData.password),
    });

    anotherUser = await userRepository.save({
      ...anotherUserData,
      password: await PasswordUtil.hashPassword(anotherUserData.password),
    });
  });

  describe("getAllPosts", () => {
    it("作成日時の降順で全ての投稿を返すべき", async () => {
      const post1 = await postRepository.save({
        ...postTestData.firstPost,
        userId: testUser.id,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, testConstants.delayMs),
      );

      const post2 = await postRepository.save({
        ...postTestData.secondPost,
        userId: anotherUser.id,
      });

      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        posts[1].createdAt.getTime(),
      );
      expect(posts[0].user).toBeDefined();
      expect(posts[1].user).toBeDefined();
    });

    it("投稿が存在しない場合は空の配列を返すべき", async () => {
      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(0);
      expect(Array.isArray(posts)).toBe(true);
    });

    it("各投稿にユーザー情報を含むべき", async () => {
      await postRepository.save({
        ...postTestData.postWithUser,
        userId: testUser.id,
      });

      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(1);
      expect(posts[0].user).toBeDefined();
      expect(posts[0].user.name).toBe(testUser.name);
      expect(posts[0].user.email).toBe(testUser.email);
    });

    it("大量の投稿を効率的に処理すべき", async () => {
      const postsToCreate = createBulkPosts(
        testConstants.bulkPostCount,
        testUser.id,
      );

      await postRepository.save(postsToCreate);

      const startTime = Date.now();
      const posts = await postService.getAllPosts();
      const endTime = Date.now();

      expect(posts).toHaveLength(testConstants.bulkPostCount);
      expect(endTime - startTime).toBeLessThan(
        testConstants.performanceThreshold,
      );
    });
  });

  describe("getPostById", () => {
    let existingPost: Post;

    beforeEach(async () => {
      existingPost = await postRepository.save({
        ...postTestData.existingPost,
        userId: testUser.id,
      });
    });

    it("有効なIDで投稿を返すべき", async () => {
      const post = await postService.getPostById(existingPost.id.toString());

      expect(post).toBeDefined();
      expect(post.id).toBe(existingPost.id);
      expect(post.title).toBe(existingPost.title);
      expect(post.content).toBe(existingPost.content);
      expect(post.user).toBeDefined();
      expect(post.user.name).toBe(testUser.name);
    });

    it("存在しない投稿IDに対してCustomErrorをスローすべき", async () => {
      await expect(
        postService.getPostById(testConstants.nonExistentId),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.getPostById(testConstants.nonExistentId),
      ).rejects.toThrow(errorMessages.postNotFound);
    });

    it("無効なID形式を適切に処理すべき", async () => {
      await expect(
        postService.getPostById(testConstants.invalidId),
      ).rejects.toThrow();
    });

    it("正しいデータ型で投稿を返すべき", async () => {
      const post = await postService.getPostById(existingPost.id.toString());

      expect(typeof post.id).toBe("number");
      expect(typeof post.title).toBe("string");
      expect(typeof post.content).toBe("string");
      expect(typeof post.userId).toBe("number");
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("createPost", () => {
    it("新しい投稿を正常に作成すべき", async () => {
      const postData = {
        ...postTestData.newPost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost).toBeDefined();
      expect(createdPost.title).toBe(postData.title);
      expect(createdPost.content).toBe(postData.content);
      expect(createdPost.userId).toBe(postData.userId);
      expect(createdPost.id).toBeDefined();
      expect(createdPost.createdAt).toBeDefined();
      expect(createdPost.updatedAt).toBeDefined();
    });

    it("ユーザーが存在しない場合はエラーをスローすべき", async () => {
      await expect(
        postService.createPost(postTestData.postByNonExistentUser),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.createPost(postTestData.postByNonExistentUser),
      ).rejects.toThrow(errorMessages.userNotFound);
    });

    it("投稿をデータベースに保存すべき", async () => {
      const postData = {
        ...postTestData.databaseTestPost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      const savedPost = await postRepository.findOne({
        where: { id: createdPost.id },
      });

      expect(savedPost).toBeDefined();
      expect(savedPost!.title).toBe(postData.title);
      expect(savedPost!.content).toBe(postData.content);
    });

    it("タイトルと内容の特殊文字を処理すべき", async () => {
      const postData = {
        ...postTestData.specialCharactersPost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost.title).toBe(postData.title);
      expect(createdPost.content).toBe(postData.content);
    });
  });

  describe("updatePost", () => {
    let existingPost: Post;

    beforeEach(async () => {
      existingPost = await postRepository.save({
        ...postTestData.originalPost,
        userId: testUser.id,
      });
    });

    it("所有者による投稿の更新を正常に処理すべき", async () => {
      const updatedPost = await postService.updatePost(
        existingPost.id.toString(),
        postTestData.updateData,
        testUser.id,
      );

      expect(updatedPost.title).toBe(postTestData.updateData.title);
      expect(updatedPost.content).toBe(postTestData.updateData.content);
      expect(updatedPost.id).toBe(existingPost.id);
      expect(updatedPost.userId).toBe(testUser.id);
    });

    it("指定されたフィールドのみを更新すべき", async () => {
      const updatedPost = await postService.updatePost(
        existingPost.id.toString(),
        postTestData.titleOnlyUpdate,
        testUser.id,
      );

      expect(updatedPost.title).toBe(postTestData.titleOnlyUpdate.title);
      expect(updatedPost.content).toBe(existingPost.content);
    });

    it("投稿が見つからない場合はエラーをスローすべき", async () => {
      await expect(
        postService.updatePost(
          testConstants.nonExistentId,
          postTestData.updateDataForNonExistent,
          testUser.id,
        ),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.updatePost(
          testConstants.nonExistentId,
          postTestData.updateDataForNonExistent,
          testUser.id,
        ),
      ).rejects.toThrow(errorMessages.postNotFound);
    });

    it("ユーザーが所有者でない場合はエラーをスローすべき", async () => {
      await expect(
        postService.updatePost(
          existingPost.id.toString(),
          postTestData.unauthorizedUpdate,
          anotherUser.id,
        ),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.updatePost(
          existingPost.id.toString(),
          postTestData.unauthorizedUpdate,
          anotherUser.id,
        ),
      ).rejects.toThrow(errorMessages.unauthorizedUpdate);
    });

    it("変更をデータベースに永続化すべき", async () => {
      await postService.updatePost(
        existingPost.id.toString(),
        postTestData.persistedUpdate,
        testUser.id,
      );

      const updatedPost = await postRepository.findOne({
        where: { id: existingPost.id },
      });

      expect(updatedPost!.title).toBe(postTestData.persistedUpdate.title);
      expect(updatedPost!.content).toBe(postTestData.persistedUpdate.content);
    });

    it("空の更新データを処理すべき", async () => {
      const updatedPost = await postService.updatePost(
        existingPost.id.toString(),
        {},
        testUser.id,
      );

      expect(updatedPost.title).toBe(existingPost.title);
      expect(updatedPost.content).toBe(existingPost.content);
    });
  });

  describe("deletePost", () => {
    let existingPost: Post;

    beforeEach(async () => {
      existingPost = await postRepository.save({
        ...postTestData.postToDelete,
        userId: testUser.id,
      });
    });

    it("所有者による投稿の削除を正常に処理すべき", async () => {
      await postService.deletePost(existingPost.id.toString(), testUser.id);

      const deletedPost = await postRepository.findOne({
        where: { id: existingPost.id },
      });

      expect(deletedPost).toBeNull();
    });

    it("投稿が見つからない場合はエラーをスローすべき", async () => {
      await expect(
        postService.deletePost(testConstants.nonExistentId, testUser.id),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.deletePost(testConstants.nonExistentId, testUser.id),
      ).rejects.toThrow(errorMessages.postNotFound);
    });

    it("ユーザーが所有者でない場合はエラーをスローすべき", async () => {
      await expect(
        postService.deletePost(existingPost.id.toString(), anotherUser.id),
      ).rejects.toThrow(CustomError);
      await expect(
        postService.deletePost(existingPost.id.toString(), anotherUser.id),
      ).rejects.toThrow(errorMessages.unauthorizedDelete);
    });

    it("他の投稿に影響を与えないべき", async () => {
      const anotherPost = await postRepository.save({
        ...postTestData.anotherPost,
        userId: anotherUser.id,
      });

      await postService.deletePost(existingPost.id.toString(), testUser.id);

      const remainingPost = await postRepository.findOne({
        where: { id: anotherPost.id },
      });

      expect(remainingPost).toBeDefined();
      expect(remainingPost!.title).toBe(anotherPost.title);
    });

    it("同時削除の試行を処理すべき", async () => {
      const deletePromises = [
        postService.deletePost(existingPost.id.toString(), testUser.id),
        postService.deletePost(existingPost.id.toString(), testUser.id),
      ];

      const results = await Promise.allSettled(deletePromises);

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const errorCount = results.filter((r) => r.status === "rejected").length;

      expect(successCount + errorCount).toBe(2);
      expect(successCount).toBeGreaterThan(0);
    });
  });

  describe("エッジケースとセキュリティ", () => {
    it("投稿内容のSQLインジェクション攻撃を処理すべき", async () => {
      const postData = {
        ...postTestData.maliciousPost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost.title).toBe(postData.title);
      expect(createdPost.content).toBe(postData.content);

      const allPosts = await postService.getAllPosts();
      expect(allPosts).toHaveLength(1);
    });

    it("非常に大きな内容を処理すべき", async () => {
      const postData = {
        ...postTestData.largeContentPost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost.content).toBe(postData.content);
      expect(createdPost.content.length).toBe(testConstants.largeContentLength);
    });

    it("Unicode文字を適切に処理すべき", async () => {
      const postData = {
        ...postTestData.unicodePost,
        userId: testUser.id,
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost.title).toBe(postData.title);
      expect(createdPost.content).toBe(postData.content);
    });

    it("負のユーザーIDを処理すべき", async () => {
      await expect(
        postService.createPost(postTestData.negativeUserIdPost),
      ).rejects.toThrow(CustomError);
    });

    it("ゼロのユーザーIDを処理すべき", async () => {
      await expect(
        postService.createPost(postTestData.zeroUserIdPost),
      ).rejects.toThrow(CustomError);
    });
  });
});
