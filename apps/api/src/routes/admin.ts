import type { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/admin/dashboard', { preHandler: fastify.requireRoles(['super_admin', 'admin', 'analyst']) }, async () => {
    const [{ count: users }, { count: withdrawals }, { count: deposits }] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('withdrawals').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('deposits').select('*', { count: 'exact', head: true }),
    ]);

    return {
      users: users ?? 0,
      withdrawals: withdrawals ?? 0,
      deposits: deposits ?? 0,
    };
  });

  fastify.get('/api/v1/admin/users', { preHandler: fastify.requireRoles(['super_admin', 'admin', 'support']) }, async () => {
    const { data, error } = await supabaseAdmin.from('users').select('id,email,status,created_at').limit(100);

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });
};
