import { t } from "elysia";

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
