import { status } from "elysia";
import type { AdminAuthModel } from "./model";
import { randomUUIDv5 } from "bun";

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
    const token = randomUUIDv5(String(Math.random()), "x500", "base64url");
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
