import { env } from './config/env.js';
import { buildApp } from './app.js';

const app = buildApp();

app
  .listen({ port: env.API_PORT, host: '0.0.0.0' })
  .then(() => app.log.info(`CenarioX API running at :${env.API_PORT}`))
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
