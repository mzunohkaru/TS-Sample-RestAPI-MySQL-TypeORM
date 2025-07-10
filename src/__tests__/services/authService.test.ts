import { AuthService } from "../../services/authService";
import { User } from "../../entity/User";
import { testDataSource } from "../setup";
import { PasswordUtil } from "../../utils/password.util";
import { JwtUtil } from "../../utils/jwt.util";
import { Repository } from "typeorm";
import { testData } from "../fixtures/authService.fixtures";

describe("AuthService（認証サービス）", () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeAll(() => {
    Object.defineProperty(require("../../data-source"), "AppDataSource", {
      value: testDataSource,
      writable: false,
    });
  });

  beforeEach(async () => {
    authService = new AuthService();
    userRepository = testDataSource.getRepository(User);
  });

  describe("register（新規登録）", () => {
    it("新しいユーザーを正常に登録できること", async () => {
      const userData = testData.register.validUser;

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.id).toBeDefined();

      const savedUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      expect(savedUser).toBeDefined();
      expect(savedUser!.name).toBe(userData.name);
      expect(savedUser!.email).toBe(userData.email);
    });

    it("保存前にパスワードがハッシュ化されること", async () => {
      const userData = testData.register.hashPasswordUser;

      await authService.register(userData);

      const savedUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      expect(savedUser!.password).not.toBe(userData.password);
      expect(savedUser!.password).toMatch(/^\$2[aby]\$\d{1,2}\$/);
    });

    it("既存ユーザーが存在する場合にエラーが発生すること", async () => {
      const userData = testData.register.existingUser;

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        "User already exists",
      );
    });

    it("有効なJWTトークンが生成されること", async () => {
      const userData = testData.register.tokenUser;

      const result = await authService.register(userData);

      expect(() => {
        JwtUtil.verifyAccessToken(result.access_token);
      }).not.toThrow();

      expect(() => {
        JwtUtil.verifyRefreshToken(result.refresh_token);
      }).not.toThrow();
    });
  });

  describe("login（ログイン）", () => {
    beforeEach(async () => {
      const hashedPassword = await PasswordUtil.hashPassword(
        testData.login.validUser.password,
      );
      await userRepository.save({
        ...testData.login.validUser,
        password: hashedPassword,
      });
    });

    it("正しい認証情報でログインが成功すること", async () => {
      const credentials = testData.login.validCredentials;

      const result = await authService.login(credentials);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.user.email).toBe(credentials.email);
      expect(result.user.name).toBe(testData.login.validUser.name);
    });

    it("存在しないユーザーでエラーが発生すること", async () => {
      const credentials = testData.login.nonExistentCredentials;

      await expect(authService.login(credentials)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("間違ったパスワードでエラーが発生すること", async () => {
      const credentials = testData.login.wrongPasswordCredentials;

      await expect(authService.login(credentials)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("ログイン成功時に有効なJWTトークンが生成されること", async () => {
      const credentials = testData.login.validCredentials;

      const result = await authService.login(credentials);

      const accessPayload = JwtUtil.verifyAccessToken(result.access_token);
      const refreshPayload = JwtUtil.verifyRefreshToken(result.refresh_token);

      expect(accessPayload.email).toBe(credentials.email);
      expect(refreshPayload.email).toBe(credentials.email);
      expect(accessPayload.userId).toBeDefined();
      expect(refreshPayload.userId).toBeDefined();
    });
  });

  describe("refreshToken（トークン更新）", () => {
    let validRefreshToken: string;
    let testUser: User;

    beforeEach(async () => {
      testUser = await userRepository.save({
        ...testData.refreshToken.user,
        password: await PasswordUtil.hashPassword(
          testData.refreshToken.user.password,
        ),
      });

      validRefreshToken = JwtUtil.generateRefreshToken({
        userId: testUser.id,
        email: testUser.email,
      });
    });

    it("有効なリフレッシュトークンで新しいアクセストークンが生成されること", async () => {
      const result = await authService.refreshToken(validRefreshToken);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();

      const payload = JwtUtil.verifyAccessToken(result.access_token);
      expect(payload.userId).toBe(testUser.id);
      expect(payload.email).toBe(testUser.email);
    });

    it("無効なリフレッシュトークンでエラーが発生すること", async () => {
      const invalidToken = testData.refreshToken.invalidToken;

      await expect(authService.refreshToken(invalidToken)).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("期限切れのリフレッシュトークンでエラーが発生すること", async () => {
      const expiredToken = JwtUtil.generateRefreshToken({
        userId: testUser.id,
        email: testUser.email,
      });

      jest.spyOn(JwtUtil, "verifyRefreshToken").mockImplementation(() => {
        throw new Error("Token expired");
      });

      await expect(authService.refreshToken(expiredToken)).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("ユーザーが存在しない場合にエラーが発生すること", async () => {
      await userRepository.remove(testUser);

      await expect(authService.refreshToken(validRefreshToken)).rejects.toThrow(
        "Invalid refresh token",
      );
    });
  });

  describe("getUserProfile（ユーザープロフィール取得）", () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await userRepository.save({
        ...testData.profile.user,
        password: await PasswordUtil.hashPassword(
          testData.profile.user.password,
        ),
      });
    });

    it("パスワード以外のユーザープロフィールが返されること", async () => {
      const profile = await authService.getUserProfile(testUser.id);

      expect(profile).toBeDefined();
      expect(profile.id).toBe(testUser.id);
      expect(profile.name).toBe(testUser.name);
      expect(profile.email).toBe(testUser.email);
      expect(profile.age).toBe(testUser.age);
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
      expect((profile as any).password).toBeUndefined();
    });

    it("存在しないユーザーでエラーが発生すること", async () => {
      const nonExistentId = testData.profile.nonExistentId;

      await expect(authService.getUserProfile(nonExistentId)).rejects.toThrow(
        "User not found",
      );
    });

    it("正しいデータ型でユーザープロフィールが返されること", async () => {
      const profile = await authService.getUserProfile(testUser.id);

      expect(typeof profile.id).toBe("number");
      expect(typeof profile.name).toBe("string");
      expect(typeof profile.email).toBe("string");
      expect(typeof profile.age).toBe("number");
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("エッジケースとセキュリティ", () => {
    it("空文字列の入力を適切に処理できること", async () => {
      const userData = testData.edgeCases.emptyData;

      await expect(authService.register(userData)).resolves.toBeDefined();
    });

    it("SQLインジェクション攻撃を適切に処理できること", async () => {
      const maliciousData = testData.edgeCases.maliciousData;

      await expect(authService.register(maliciousData)).resolves.toBeDefined();

      const userCount = await userRepository.count();
      expect(userCount).toBe(1);
    });

    it("同じメールアドレスでの同時登録を適切に処理できること", async () => {
      const userData = testData.edgeCases.concurrentUser;

      const registrationPromises = [
        authService.register(userData),
        authService.register(userData),
      ];

      const results = await Promise.allSettled(registrationPromises);

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const errorCount = results.filter((r) => r.status === "rejected").length;

      expect(successCount).toBe(1);
      expect(errorCount).toBe(1);
    });

    it("非常に長い入力文字列を適切に処理できること", async () => {
      const { longString } = testData.edgeCases.longStringUser;
      const userData = {
        name: longString,
        email: `${longString}@example.com`,
        password: `${longString}123!`,
      };

      await expect(authService.register(userData)).resolves.toBeDefined();
    });
  });
});
