import { Hono } from "hono";

const database = new Hono();

// TODO: Add database routes
database.get("/", (c) => {
  return c.json({ message: "Database routes" });
});

export default database;
