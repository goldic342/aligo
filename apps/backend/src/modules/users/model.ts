import { t } from "elysia";

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
