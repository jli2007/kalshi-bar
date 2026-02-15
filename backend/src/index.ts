import 'dotenv/config';
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { weather, kalshi } from "./routes";

const app = new Hono();

// Request logging
app.use("*", logger());

// CORS
app.use("/*", cors());

// Routes
app.route("/weather", weather);
app.route("/kalshi", kalshi);

app.get('/', (c) => {
  console.log('📍 Health check');
  return c.json({ name: 'Kalshi Bars Server', status: 'ok' });
});

console.log('🚀 Starting Kalshi Bars Server on port 3001...');
console.log('📝 Environment check:');
console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Set' : 'Missing'}`);
console.log(`   KALSHI_API_KEY: ${process.env.KALSHI_API_KEY ? 'Set' : 'Missing'}`);
console.log(`   WEATHER_API_KEY: ${process.env.WEATHER_API_KEY ? 'Set' : 'Missing'}`);

export default {
  port: 3001,
  fetch: app.fetch,
};
