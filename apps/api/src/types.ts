export type Role = 'super_admin' | 'admin' | 'finance' | 'support' | 'analyst' | 'user';

export type AuditAction =
  | 'request'
  | 'auth_signin'
  | 'auth_signup'
  | 'role_assigned'
  | 'role_revoked'
  | 'payment_webhook'
  | 'finance_view';
