import { Elysia } from "elysia";
import { users } from "./modules/users";
import { adminAuth } from "./modules/auth";

const app = new Elysia().use(adminAuth).use(users).listen(3000);

console.log(`Elysia is running on ${app.server?.hostname}:${app.server?.port}`);
