import 'dotenv/config';
import { Hono } from "hono";
import { cors } from "hono/cors";
import { weather, database, kalshi } from "./routes";
import type { Context } from 'hono';

const app = new Hono();

app.use('*', async (c: Context, next) => {
  if (!c.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    return c.json({ error: 'Server misconfiguration: api key not set' }, 500);
  }
  await next();
});

app.use("/*", cors());

app.route("/weather", weather);
app.route("/database", database);
app.route("/kalshi", kalshi);

app.get('/', (c) => c.json({
  name: 'Kalshi Bars Server',
  // version: '1.0.0',
  // endpoints: {
  //   relations: '/api/relations',
  //   relationsPricing: '/api/relations/price',
  //   relationsGraph: '/api/relations/graph',
  //   relationsGraphPricing: '/api/relations/graph/price',
  //   relatedBets: '/api/related-bets',
  //   dependencies: '/api/dependencies',
  // },
} as const));

export default {
  port: 3001,
  fetch: app.fetch,
};
