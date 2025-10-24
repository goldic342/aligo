import { createAdminSessionTable } from "../modules/auth/model";
import { createUserTable } from "../modules/user/model";

export default async function setupTables(): Promise<void> {
  await createAdminSessionTable();
  await createUserTable();
}
