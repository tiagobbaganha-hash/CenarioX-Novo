import type { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const auditRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/audit/logs', { preHandler: fastify.requireRoles(['super_admin', 'admin']) }, async () => {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('id,actor_user_id,action,resource,method,status_code,ip_address,created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });
};
