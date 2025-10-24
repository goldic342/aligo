import * as OTPAuth from "otpauth";
import { UserModel } from "./model";
import sqlite from "@db/client";
import { randomUUID } from "crypto";
import { status } from "elysia";
import { generateTOTP, getTOTPURI } from "@shared/auth/totp";

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

    const totp = generateTOTP(userData.id);
    userData.totpSecret = totp.secret;

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

    return { uri: getTOTPURI(user.id, user.totpSecret) };
  }

  static async getUserById(id: string): Promise<UserModel.user> {
    const [user] = await sqlite`SELECT * FROM user WHERE id=${id}`;

    return user;
  }

  static async editUser(id: string, editMap: object): Promise<UserModel.user> {
    const [response] = await sqlite`
UPDATE user 
SET ${sqlite(editMap)}
WHERE id=${id}
`;

    return response;
  }
}
