import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getUserRoles, hasRequiredRole } from '../lib/rbac.js';
import { supabaseAnon } from '../lib/supabase.js';
import type { Role } from '../types.js';

const bearerSchema = z.string().regex(/^Bearer\s+.+$/i);

declare module 'fastify' {
  interface FastifyRequest {
    authUserId?: string;
    authRoles?: Role[];
  }

  interface FastifyInstance {
    requireAuth: (request: FastifyRequest) => Promise<void>;
    requireRoles: (roles: Role[]) => (request: FastifyRequest) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('requireAuth', async (request: FastifyRequest) => {
    const parsedBearer = bearerSchema.safeParse(request.headers.authorization ?? '');

    if (!parsedBearer.success) {
      throw fastify.httpErrors.unauthorized('Authorization header inválido.');
    }

    const token = parsedBearer.data.split(' ')[1];
    const { data, error } = await supabaseAnon.auth.getUser(token);

    if (error || !data.user) {
      throw fastify.httpErrors.unauthorized('Token inválido ou expirado.');
    }

    request.authUserId = data.user.id;
    request.authRoles = await getUserRoles(data.user.id);
  });

  fastify.decorate('requireRoles', (roles: Role[]) => {
    return async (request: FastifyRequest) => {
      await fastify.requireAuth(request);

      if (!request.authRoles || !hasRequiredRole(request.authRoles, roles)) {
        throw fastify.httpErrors.forbidden('Você não possui permissão para este recurso.');
      }
    };
  });
};

export const auth = fp(authPlugin);
