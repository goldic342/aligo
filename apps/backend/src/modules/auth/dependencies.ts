import { Elysia, status } from "elysia";
import { AdminAuth } from "./service";

export const adminAuth = new Elysia({ name: "admin-auth" }).derive(
  { as: "global" },
  async ({ cookie: { aligo_admin } }) => {
    const response = await AdminAuth.validateSession(aligo_admin.value);
    return response;
  },
);
