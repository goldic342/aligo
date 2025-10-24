import { Elysia, status } from "elysia";
import { adminAuth } from "@modules/auth/dependencies";
import { User } from "./service";
import { UserModel } from "./model";
import { Auth } from "@modules/auth/service";
import { AuthModel } from "@modules/auth/model";
import { ok } from "@shared/model/ok";

export const user = new Elysia({ prefix: "/user" })
  .use(adminAuth)
  .post(
    "",
    async ({ body }) => {
      const response = await User.create(body);
      return response;
    },
    { body: UserModel.createBody },
  )
  .get(
    "/totp/:id",
    async ({ params }) => {
      const response = await User.getTOTPURI(params);
      return response;
    },
    {
      params: UserModel.totpURIBody,
    },
  )
  .post(
    "/totp",
    async ({ body }) => {
      await Auth.verifyTOTP(body);

      const response = await User.editUser(body.id, { totpVerified: true });
      return { ok: true };
    },
    { body: AuthModel.verifyTOTPBody, response: ok },
  );
