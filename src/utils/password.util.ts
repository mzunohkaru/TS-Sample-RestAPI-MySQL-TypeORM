import bcrypt from "bcryptjs";

export class PasswordUtil {
  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    return bcrypt.hash(password, saltRounds);
  }

  public static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
