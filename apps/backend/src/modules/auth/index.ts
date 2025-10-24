import { Elysia } from "elysia";
import { AdminAuth } from "./service";
import { AdminAuthModel } from "./model";
import { ok } from "@shared/model/ok";

export const auth = new Elysia({ prefix: "/auth" });

export const adminAuth = new Elysia({ prefix: "/admin" }).post(
  "/sign-in",
  async ({ body, cookie: { aligo_admin } }) => {
    const response = await AdminAuth.signIn(body);

    aligo_admin.value = response.token;

    return { ok: true };
  },
  { body: AdminAuthModel.signInBody, response: ok },
);
