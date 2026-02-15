import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase.js';
import type { Role } from '../types.js';

const assignRoleSchema = z.object({
  userId: z.uuid(),
  role: z.enum(['super_admin', 'admin', 'finance', 'support', 'analyst', 'user']),
});

export const rbacRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/rbac/assign-role', { preHandler: fastify.requireRoles(['super_admin']) }, async (request) => {
    const actor = request.authUserId;
    const payload = assignRoleSchema.parse(request.body);
    const { data: roleRow, error: roleError } = await supabaseAdmin.from('roles').select('id').eq('name', payload.role).single();

    if (roleError || !roleRow) {
      throw fastify.httpErrors.badRequest('Role não encontrada.');
    }

    const { error } = await supabaseAdmin.from('user_roles').upsert(
      {
        user_id: payload.userId,
        role_id: roleRow.id,
        created_by: actor,
        updated_by: actor,
      },
      { onConflict: 'user_id,role_id' },
    );

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return { success: true, assigned: payload.role };
  });

  fastify.get('/api/v1/rbac/roles', { preHandler: fastify.requireRoles(['super_admin', 'admin']) }, async () => {
    const { data, error } = await supabaseAdmin.from('roles').select('id,name,description').order('name');

    if (error) {
      throw fastify.httpErrors.badRequest(error.message);
    }

    return data;
  });
};
