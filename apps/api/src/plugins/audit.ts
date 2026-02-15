import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import type { AuditAction } from '../types.js';
import { getIpFromRequest } from '../lib/rbac.js';
import { supabaseAdmin } from '../lib/supabase.js';

const auditPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onResponse', async (request, reply) => {
    const route = request.routeOptions.url;

    if (!route || route === '/health') {
      return;
    }

    const action: AuditAction = (route.includes('/auth') ? 'auth_signin' : 'request') as AuditAction;

    await supabaseAdmin.from('audit_logs').insert({
      actor_user_id: request.authUserId ?? null,
      action,
      resource: route,
      method: request.method,
      status_code: reply.statusCode,
      ip_address: getIpFromRequest(request),
      user_agent: request.headers['user-agent'] ?? null,
      metadata: {
        query: request.query,
        params: request.params,
      },
    });
  });
};

export const audit = fp(auditPlugin);
