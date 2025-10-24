import { t } from "elysia";
import sqlite from "../../db/client";

export namespace UserModel {
  export const user = t.Object({
    id: t.String(), // uuid4
    username: t.String(),
    createdAt: t.Date(),
    totpSecret: t.Optional(t.String()),
  });

  export const createBody = t.Object({
    username: t.String(),
  });

  export const createResponse = t.Object({
    username: t.String(),
    id: t.String(),
  });

  export type user = typeof user.static;
  export type createBody = typeof createBody.static;
  export type createResponse = typeof createResponse.static;
}

export async function createUserTable() {
  await sqlite`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      totp_secret TEXT
    )
  `;
}
