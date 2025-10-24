import { status } from "elysia";
import type { AdminAuthModel, AuthModel } from "./model";
import { randomUUID } from "crypto";
import { User } from "@modules/user/service";
import sqlite from "@db/client";
import { verifyTOTP } from "@shared/auth/totp";
import { ok } from "@shared/model/ok";

export abstract class Auth {
  static async verifyTOTP({
    id,
    totpToken,
  }: AuthModel.verifyTOTPBody): Promise<ok> {
    const user = await User.getUserById(id);
    if (!user) throw status(404, "Not Found");

    const valid = verifyTOTP(user.totpSecret, totpToken, user.id);

    if (!valid)
      throw status(400, "TOTP code invalid" satisfies AuthModel.TOTPInvalid);

    return { ok: true };
  }

  static async logIn({
    username,
    totpToken,
  }: AuthModel.logInBody): Promise<boolean> {
    const user = await User.getUserByUsername(username);

    if (!user) throw status(404, "Not Found");

    const valid = verifyTOTP(user.totpSecret, totpToken, user.id);

    if (!valid)
      throw status(400, "TOTP code invalid" satisfies AuthModel.TOTPInvalid);

    return true; // Return session cookie here
  }
}

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
      token: await this.genAndSaveToken(),
    };
  }

  private static async genAndSaveToken(): Promise<string> {
    const token = randomUUID();
    await sqlite`INSERT INTO "adminSession" ${sqlite({ token: token, createdAt: Date.now() })}
    RETURNING *`;
    return token;
  }

  static async validateSession(token?: string): Promise<void> {
    if (!token) throw status(401, "Unauthorized");

    const [session] =
      await sqlite`SELECT * FROM "adminSession" WHERE token=${token}`;

    if (!session) throw status(401, "Unauthorized");

    // Ensure token not expired
    if (
      session.createdAt + Number(Bun.env.ROOT_SESSION_TTL) * 1000 <
      Date.now()
    )
      throw status(401, "Session expired");
  }
}
