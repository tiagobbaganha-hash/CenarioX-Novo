import type { FastifyRequest } from 'fastify';
import type { Role } from '../types.js';
import { supabaseAdmin } from './supabase.js';

export async function getUserRoles(userId: string): Promise<Role[]> {
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Failed loading roles: ${error.message}`);
  }

  const names = (data ?? [])
    .map((row) => (row as { roles?: { name?: Role } }).roles?.name)
    .filter((name): name is Role => Boolean(name));

  return names;
}

export function hasRequiredRole(userRoles: Role[], acceptedRoles: Role[]): boolean {
  if (acceptedRoles.includes('super_admin') && userRoles.includes('super_admin')) {
    return true;
  }

  return acceptedRoles.some((role) => userRoles.includes(role));
}

export function getIpFromRequest(request: FastifyRequest): string {
  return request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ?? request.ip;
}
