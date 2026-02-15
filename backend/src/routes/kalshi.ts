import { Hono } from "hono";

const kalshi = new Hono();

// TODO: Add Kalshi API routes
kalshi.get("/", (c) => {
  return c.json({ message: "Kalshi routes" });
});

export default kalshi;
