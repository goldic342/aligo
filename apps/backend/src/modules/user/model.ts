import { t } from "elysia";
import sqlite from "@db/client";

export namespace UserModel {
  export const user = t.Object({
    id: t.String(), // uuid4
    username: t.String(),
    createdAt: t.Date(),
    totpSecret: t.String(),
    totpVerified: t.Boolean(),
  });

  export const createBody = t.Object({
    username: t.String(),
  });

  export const createResponse = t.Object({
    username: t.String(),
    id: t.String(),
  });

  export const totpURIBody = t.Object({
    id: t.String(),
  });
  export const totpURIResponse = t.Object({
    uri: t.String(),
  });

  export type user = typeof user.static;
  export type createBody = typeof createBody.static;
  export type createResponse = typeof createResponse.static;

  export type totpURIBody = typeof totpURIBody.static;
  export type totpURIResponse = typeof totpURIResponse.static;

  export const TOTPAlreadyVerified = t.Literal("TOTP already verified");
  export type TOTPAlreadyVerified = typeof TOTPAlreadyVerified.static;
  export const UserNotFound = t.Literal("User Not Found");
  export type UserNotFound = typeof UserNotFound.static;
}

export async function createUserTable() {
  await sqlite`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "username" TEXT NOT NULL UNIQUE,
      "createdAt" TEXT NOT NULL,
      "totpSecret" TEXT NOT NULL,
      "totpVerified" BOOLEAN DEFAULT 0
    )
  `;
}
