import { SQL } from "bun";

const sqlite = new SQL({
  adapter: "sqlite",
  filename: "./data/aligo.db",
});

export default sqlite;
