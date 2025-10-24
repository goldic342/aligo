import { t } from "elysia";

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
