import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { env } from '../config/env.js';

const stripeWebhookSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  data: z.unknown(),
});

const mercadoPagoWebhookSchema = z.object({
  id: z.string().or(z.number()),
  topic: z.string().optional(),
  type: z.string().optional(),
  action: z.string().optional(),
});

const idempotencyMap = new Map<string, number>();

function isDuplicate(eventId: string): boolean {
  if (idempotencyMap.has(eventId)) {
    return true;
  }

  idempotencyMap.set(eventId, Date.now());
  return false;
}

export const paymentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/payments/stripe/webhook', async (request, reply) => {
    const signature = request.headers['stripe-signature'];

    if (!signature || signature !== env.STRIPE_WEBHOOK_SECRET) {
      return reply.status(401).send({ error: 'Invalid stripe webhook signature.' });
    }

    const payload = stripeWebhookSchema.parse(request.body);
    if (isDuplicate(`stripe-${payload.id}`)) {
      return reply.status(200).send({ duplicated: true });
    }

    return reply.status(200).send({ received: true, provider: 'stripe', eventType: payload.type });
  });

  fastify.post('/api/v1/payments/mercadopago/webhook', async (request, reply) => {
    const signature = request.headers['x-signature']?.toString();

    if (!signature || signature !== env.MERCADOPAGO_WEBHOOK_SECRET) {
      return reply.status(401).send({ error: 'Invalid mercado pago webhook signature.' });
    }

    const payload = mercadoPagoWebhookSchema.parse(request.body);
    if (isDuplicate(`mp-${payload.id}`)) {
      return reply.status(200).send({ duplicated: true });
    }

    return reply.status(200).send({ received: true, provider: 'mercadopago' });
  });
};
