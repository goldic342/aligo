import { Elysia } from "elysia";
import { adminAuth } from "../auth/dependencies";

export const user = new Elysia({ prefix: "/user" })
  .use(adminAuth)
  .post("", async ({ status }) => {
    return "ok!";
  });
