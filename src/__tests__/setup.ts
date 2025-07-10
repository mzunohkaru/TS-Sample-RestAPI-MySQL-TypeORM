import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Post } from "../entity/Post";
import * as dotenv from "dotenv";

dotenv.config();

export let testDataSource: DataSource;

beforeAll(async () => {
  testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
  });

  await testDataSource.initialize();
});

afterAll(async () => {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});

beforeEach(async () => {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.synchronize(true);
  }
});

process.env.JWT_ACCESS_SECRET =
  "test-access-secret-key-for-testing-minimum-32-chars";
process.env.JWT_REFRESH_SECRET =
  "test-refresh-secret-key-for-testing-minimum-32-chars";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.BCRYPT_SALT_ROUNDS = "4";
process.env.NODE_ENV = "test";
