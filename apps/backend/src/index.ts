import { Elysia } from "elysia";
import { user } from "@modules/user";
import { adminAuth, auth } from "@modules/auth";
import setupTables from "@db/setup";

setupTables();
console.log("Database setup finished");

const app = new Elysia().use(adminAuth).use(auth).use(user).listen(3000);

console.log(`Elysia is running on ${app.server?.hostname}:${app.server?.port}`);
