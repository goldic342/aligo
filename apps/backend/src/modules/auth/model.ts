import { t } from "elysia";
import sqlite from "../../db/client";

export namespace AuthModel {
  export const verifyTOTPBody = t.Object({
    id: t.String(),
    totpToken: t.String(),
  });

  export type verifyTOTPBody = typeof verifyTOTPBody.static;
}

export namespace AdminAuthModel {
  export const signInBody = t.Object({
    password: t.String(),
    username: t.String(),
  });

  export const signInResponse = t.Object({
    username: t.String(),
    token: t.String(),
  });
  export type signInBody = typeof signInBody.static;
  export type signInResponse = typeof signInResponse.static;
}

export async function createAdminSessionTable() {
  await sqlite`
  CREATE TABLE IF NOT EXISTS "adminSession"(
    "token" TEXT PRIMARY KEY,
    "createdAt" TEXT NOT NULL
  )
`;
}
