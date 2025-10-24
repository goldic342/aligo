import { Elysia } from "elysia";
import { AdminAuth, Auth } from "./service";
import { AdminAuthModel, AuthModel } from "./model";

export const auth = new Elysia({ prefix: "/auth" }).post(
  "/totp-validate",
  async ({ body }) => {
    const response = await Auth.verifyTOTP(body);

    return response;
  },
  { body: AuthModel.verifyTOTPBody },
);

export const adminAuth = new Elysia({ prefix: "/admin" }).post(
  "/sign-in",
  async ({ body, cookie: { aligo_admin } }) => {
    const response = await AdminAuth.signIn(body);

    aligo_admin.value = response.token;

    return response;
  },
  { body: AdminAuthModel.signInBody },
);
