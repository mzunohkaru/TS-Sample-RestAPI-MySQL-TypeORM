// テストデータを外出し
export const testData = {
  // 新規登録用のテストデータ
  register: {
    validUser: {
      name: "山田太郎",
      email: "yamada@example.com",
      password: "SecurePass123!",
    },
    hashPasswordUser: {
      name: "田中花子",
      email: "tanaka@example.com",
      password: "MySecurePassword123!",
    },
    existingUser: {
      name: "既存ユーザー",
      email: "existing@example.com",
      password: "ExistingPass123!",
    },
    tokenUser: {
      name: "トークンユーザー",
      email: "token@example.com",
      password: "TokenPass123!",
    },
  },

  // ログイン用のテストデータ
  login: {
    validUser: {
      name: "ログインユーザー",
      email: "login@example.com",
      password: "LoginPass123!",
      age: 25,
    },
    validCredentials: {
      email: "login@example.com",
      password: "LoginPass123!",
    },
    nonExistentCredentials: {
      email: "nonexistent@example.com",
      password: "AnyPassword123!",
    },
    wrongPasswordCredentials: {
      email: "login@example.com",
      password: "WrongPassword123!",
    },
  },

  // リフレッシュトークン用のテストデータ
  refreshToken: {
    user: {
      name: "リフレッシュユーザー",
      email: "refresh@example.com",
      password: "RefreshPass123!",
      age: 30,
    },
    invalidToken: "invalid.token.here",
  },

  // プロフィール用のテストデータ
  profile: {
    user: {
      name: "プロフィールユーザー",
      email: "profile@example.com",
      password: "ProfilePass123!",
      age: 28,
    },
    nonExistentId: 99999,
  },

  // エッジケース用のテストデータ
  edgeCases: {
    emptyData: {
      name: "",
      email: "",
      password: "",
    },
    maliciousData: {
      name: "'; DROP TABLE users; --",
      email: "malicious@example.com'; DROP TABLE users; --",
      password: "MaliciousPass123!",
    },
    concurrentUser: {
      name: "同時実行ユーザー",
      email: "concurrent@example.com",
      password: "ConcurrentPass123!",
    },
    longStringUser: {
      longString: "a".repeat(1000),
      password: "LongStringPass123!",
    },
  },
};
