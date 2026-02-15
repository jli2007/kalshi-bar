import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/weather", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");

  if (!lat || !lon) {
    return c.json({ error: "lat and lon query parameters are required" }, 400);
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return c.json({ error: "WEATHER_API_KEY not configured" }, 500);
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    return c.json({ error: data.message || "Failed to fetch weather" }, res.status);
  }

  return c.json(data);
});

export default {
  port: 3001,
  fetch: app.fetch,
};
