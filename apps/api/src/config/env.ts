import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '../../.env' });
dotenv.config();

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string().min(5),
  GOOGLE_CLIENT_SECRET: z.string().min(5),
  APPLE_CLIENT_ID: z.string().min(5),
  APPLE_TEAM_ID: z.string().min(5),
  APPLE_KEY_ID: z.string().min(5),
  APPLE_PRIVATE_KEY: z.string().min(10),
  STRIPE_SECRET_KEY: z.string().min(5),
  STRIPE_WEBHOOK_SECRET: z.string().min(5),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(5),
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(5),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().min(5),
  CLOUDFLARE_API_TOKEN: z.string().min(5),
  CLOUDFLARE_ZONE_ID: z.string().min(5),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(5),
  JWT_SECRET: z.string().min(16),
  ENCRYPTION_KEY: z.string().min(16),
  APP_BASE_URL: z.url().default('http://localhost:3001'),
  API_PORT: z.coerce.number().default(3001),
});

export const env = envSchema.parse(process.env);
