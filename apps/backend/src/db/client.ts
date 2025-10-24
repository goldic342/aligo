import { SQL } from "bun";

import { mkdir } from "node:fs/promises";

await mkdir("./data/", { recursive: true });
const sqlite = new SQL({
  adapter: "sqlite",
  filename: "./data/aligo.db",
});

export default sqlite;
