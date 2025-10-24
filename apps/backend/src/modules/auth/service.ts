import { status } from "elysia";
import * as OTPAuth from "otpauth";
import type { AdminAuthModel, AuthModel } from "./model";
import { randomUUID } from "crypto";
import { User } from "../user/service";
import sqlite from "../../db/client";

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
