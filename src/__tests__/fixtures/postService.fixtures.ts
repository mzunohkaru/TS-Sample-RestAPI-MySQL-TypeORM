// ユーザーテストデータ
export const testUserData = {
  name: "Test User",
  email: "test@example.com",
  password: "TestPass123!",
  age: 25,
};

export const anotherUserData = {
  name: "Another User",
  email: "another@example.com",
  password: "AnotherPass123!",
  age: 30,
};

// 投稿テストデータ
export const postTestData = {
  // getAllPostsテスト用
  firstPost: {
    title: "First Post",
    content: "This is the first post",
  },
  secondPost: {
    title: "Second Post",
    content: "This is the second post",
  },

  // getPostByIdテスト用
  existingPost: {
    title: "Existing Post",
    content: "This is an existing post",
  },

  // createPostテスト用
  newPost: {
    title: "New Post",
    content: "This is a new post content",
  },
  postByNonExistentUser: {
    title: "Post by Non-existent User",
    content: "This should fail",
    userId: 99999,
  },
  databaseTestPost: {
    title: "Database Test Post",
    content: "This should be saved to database",
  },
  specialCharactersPost: {
    title: "Special Characters: !@#$%^&*()_+{}[]|\\:\";'<>?,./`~",
    content: "Content with special chars: áéíóú ñ 中文 日本語 🚀 🎉",
  },

  // updatePostテスト用
  originalPost: {
    title: "Original Title",
    content: "Original content",
  },
  updateData: {
    title: "Updated Title",
    content: "Updated content",
  },
  titleOnlyUpdate: {
    title: "New Title Only",
  },
  updateDataForNonExistent: {
    title: "Updated Title",
  },
  unauthorizedUpdate: {
    title: "Unauthorized Update",
  },
  persistedUpdate: {
    title: "Persisted Update",
    content: "Persisted content",
  },

  // deletePostテスト用
  postToDelete: {
    title: "Post to Delete",
    content: "This post will be deleted",
  },
  anotherPost: {
    title: "Another Post",
    content: "This should remain",
  },

  // エッジケース・セキュリティテスト用
  postWithUser: {
    title: "Post with User",
    content: "This post should include user info",
  },
  maliciousPost: {
    title: "'; DROP TABLE posts; --",
    content: "Content with SQL injection: '; DELETE FROM posts; --",
  },
  largeContentPost: {
    title: "Large Content Post",
    content: "a".repeat(10000),
  },
  unicodePost: {
    title: "🚀 Unicode Test Post 中文 日本語",
    content:
      "Content with emojis: 🎉🔥💯 and various languages: こんにちは 你好",
  },
  negativeUserIdPost: {
    title: "Negative User ID Test",
    content: "This should fail",
    userId: -1,
  },
  zeroUserIdPost: {
    title: "Zero User ID Test",
    content: "This should fail",
    userId: 0,
  },
};

// テスト用の定数
export const testConstants = {
  nonExistentId: "99999",
  invalidId: "not-a-number",
  performanceThreshold: 1000,
  bulkPostCount: 100,
  largeContentLength: 10000,
  delayMs: 100,
};

// バルク投稿作成用のヘルパー関数
export const createBulkPosts = (count: number, userId: number) => {
  return Array.from({ length: count }, (_, i) => ({
    title: `Post ${i + 1}`,
    content: `Content for post ${i + 1}`,
    userId,
  }));
};

// エラーメッセージ
export const errorMessages = {
  postNotFound: "Post not found",
  userNotFound: "User not found",
  unauthorizedUpdate: "Unauthorized to update this post",
  unauthorizedDelete: "Unauthorized to delete this post",
};
