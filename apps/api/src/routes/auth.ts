import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { env } from '../config/env.js';
import { supabaseAnon } from '../lib/supabase.js';

const emailAuthSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/auth/email/signup', async (request, reply) => {
    const payload = emailAuthSchema.parse(request.body);
    const { data, error } = await supabaseAnon.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return { user: data.user, session: data.session };
  });

  fastify.post('/api/v1/auth/email/signin', async (request, reply) => {
    const payload = emailAuthSchema.parse(request.body);
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return reply.status(401).send({ error: error.message });
    }

    return { user: data.user, session: data.session };
  });

  fastify.get('/api/v1/auth/oauth/google', async () => {
    const { data, error } = await supabaseAnon.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${env.APP_BASE_URL}/api/v1/auth/oauth/callback` },
    });

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return { provider: 'google', url: data.url, clientId: env.GOOGLE_CLIENT_ID };
  });

  fastify.get('/api/v1/auth/oauth/apple', async () => {
    const { data, error } = await supabaseAnon.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${env.APP_BASE_URL}/api/v1/auth/oauth/callback` },
    });

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return {
      provider: 'apple',
      url: data.url,
      clientId: env.APPLE_CLIENT_ID,
      keyId: env.APPLE_KEY_ID,
      teamId: env.APPLE_TEAM_ID,
    };
  });
};
