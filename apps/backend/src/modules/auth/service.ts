import { status } from "elysia";
import * as OTPAuth from "otpauth";
import type { AdminAuthModel, AuthModel } from "./model";
import { randomUUID } from "crypto";
import { User } from "../user/service";

export abstract class Auth {
  static async verifyTOTP({
    id,
    totpToken,
  }: AuthModel.verifyTOTPBody): Promise<boolean> {
    const user = await User.getUserById(id);

    if (!user) throw status(404, "Not Found");

    const totp = new OTPAuth.TOTP({
      issuer: "aligo",
      label: id,
      secret: user.totpSecret,
    });

    const delta = totp.validate({ token: totpToken, window: 1 });

    return delta !== null;
  }
}

// LEGACY interface, will be replaced with dedicated sql table
const AdminSessions = new Map<string, number>();

export abstract class AdminAuth {
  static async signIn({
    username,
    password,
  }: AdminAuthModel.signInBody): Promise<AdminAuthModel.signInResponse> {
    if (
      Bun.env.ROOT_PASSWORD !== password ||
      Bun.env.ROOT_USERNAME !== username
    ) {
      throw status(400, "Invalid username or password");
    }

    return {
      username: username,
      token: this.genAndSaveToken(),
    };
  }

  private static genAndSaveToken(): string {
    const token = randomUUID();
    AdminSessions.set(token, Date.now() / 3600);
    return token;
  }
  static async validateSession(token?: string): Promise<void> {
    if (!token) throw status(401, "Unauthorized");

    const expiresAt = AdminSessions.get(token);
    if (!expiresAt) throw status(401, "Unauthorized");

    // Ensure token not expired
    if (expiresAt + Number(Bun.env.ROOT_SESSION_TTL) < Date.now() / 3600)
      throw status(401, "Session expired");
  }
}
