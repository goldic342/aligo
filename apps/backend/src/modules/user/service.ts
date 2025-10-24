import * as OTPAuth from "otpauth";
import { UserModel } from "./model";
import sqlite from "../../db/client";
import { randomUUID } from "crypto";
import { status } from "elysia";

export abstract class User {
  static async create({
    username,
  }: UserModel.createBody): Promise<UserModel.createResponse> {
    const userData = {
      id: randomUUID(),
      username,
      createdAt: new Date().toISOString(),
      totpVerified: false,
      totpSecret: "",
    };

    const totp = new OTPAuth.TOTP({
      issuer: "aligo",
      label: userData.id,
    });

    userData.totpSecret = totp.secret.base32;

    const [user] = await sqlite`
  INSERT INTO user ${sqlite(userData)}
  RETURNING *`;
    return { username, id: user.id };
  }

  static async getTOTPURI({
    id,
  }: UserModel.totpURIBody): Promise<UserModel.totpURIResponse> {
    const user = await User.getUserById(id);
    if (!user) throw status(404, "Not Found");
    const totp = new OTPAuth.TOTP({
      issuer: "aligo",
      label: id,
      secret: OTPAuth.Secret.fromBase32(user.totpSecret),
    });

    return { uri: totp.toString() };
  }

  static async getUserById(id: string): Promise<UserModel.user> {
    const [user] = await sqlite`SELECT * FROM user WHERE id=${id}`;

    return user;
  }
}
