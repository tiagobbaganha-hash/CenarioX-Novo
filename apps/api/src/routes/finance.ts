import type { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const financeRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/finance/transactions', { preHandler: fastify.requireRoles(['super_admin', 'admin', 'finance']) }, async () => {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('id,user_id,provider,amount,currency,status,created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });

  fastify.get('/api/v1/finance/withdrawals', { preHandler: fastify.requireRoles(['super_admin', 'admin', 'finance']) }, async () => {
    const { data, error } = await supabaseAdmin
      .from('withdrawals')
      .select('id,user_id,amount,status,created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });

  fastify.get('/api/v1/finance/ledger', { preHandler: fastify.requireRoles(['super_admin', 'admin', 'finance', 'analyst']) }, async () => {
    const { data, error } = await supabaseAdmin
      .from('ledger_entries')
      .select('id,user_id,entry_type,amount,balance_after,reference_type,reference_id,created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });
};
