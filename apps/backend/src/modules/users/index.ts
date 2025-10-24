import { Elysia } from "elysia";
import { adminAuth } from "../auth/dependencies";

export const users = new Elysia({ prefix: "/users" })
  .use(adminAuth)
  .post("", async ({ status }) => {
    return "ok!";
  });
