import { createUserTable } from "../modules/user/model";

import { mkdir } from "node:fs/promises";

export default async function setupTables(): Promise<void> {
  await mkdir("./data/", { recursive: true });
  await createUserTable();
}
