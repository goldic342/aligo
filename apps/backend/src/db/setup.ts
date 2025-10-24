import { createUserTable } from "../modules/user/model";

export default async function setupTables(): Promise<void> {
  await createUserTable();
}
