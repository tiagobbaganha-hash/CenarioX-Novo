import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { ZodError } from 'zod';
import { auth } from './plugins/auth.js';
import { audit } from './plugins/audit.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { rbacRoutes } from './routes/rbac.js';
import { adminRoutes } from './routes/admin.js';
import { financeRoutes } from './routes/finance.js';
import { paymentRoutes } from './routes/payments.js';
import { auditRoutes } from './routes/audit.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true, credentials: true });
  app.register(sensible);
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({ error: 'Too many requests, please try again later.' }),
  });

  app.register(auth);
  app.register(audit);

  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(rbacRoutes);
  app.register(adminRoutes);
  app.register(financeRoutes);
  app.register(paymentRoutes);
  app.register(auditRoutes);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: 'Validation error', issues: error.issues });
    }

    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const statusCode = Number((error as { statusCode?: number }).statusCode ?? 500);
      const message = (error as { message?: string }).message ?? 'Internal server error';
      return reply.status(statusCode).send({ error: message });
    }

    app.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  });

  return app;
}
