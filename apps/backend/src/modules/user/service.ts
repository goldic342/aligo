import * as OTPAuth from "otpauth";
import { UserModel } from "./model";
import sqlite from "../../db/client";
import { randomUUID } from "crypto";

export abstract class User {
  static async create({
    username,
  }: UserModel.createBody): Promise<UserModel.createResponse> {
    const totp = new OTPAuth.TOTP({
      issuer: "aligo",
      label: username,
    });

    const userData = {
      id: randomUUID(),
      username,
      created_at: new Date().toISOString(),
      totp_secret: totp.secret.base32,
    };

    const response = await sqlite`
  INSERT INTO user ${sqlite(userData)}
  RETURNING *`;
    return { username, id: response[0].id };
  }
}
