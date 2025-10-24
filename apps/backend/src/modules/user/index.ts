import { Elysia } from "elysia";
import { adminAuth } from "../auth/dependencies";
import { User } from "./service";
import { UserModel } from "./model";

export const user = new Elysia({ prefix: "/user" }).use(adminAuth).post(
  "",
  async ({ body }) => {
    const response = await User.create(body);
    return response;
  },
  { body: UserModel.createBody },
);
