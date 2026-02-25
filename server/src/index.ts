import express from 'express';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// tRPC setup
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// tRPC Router
const appRouter = router({
  // Clients
  getClients: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }),

  getClient: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', input.id)
        .single();
      if (error) throw error;
      return data;
    }),

  // Séances
  getSeances: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('seances')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return data;
  }),

  // Programmes
  getProgrammes: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }),

  // Paiements
  getPaiements: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('paiements')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }),
});

export type AppRouter = typeof appRouter;

// Middleware
app.use(cors());
app.use(express.json());

// tRPC middleware
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({ router: appRouter })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CoachOS API running on port ${PORT}`);
});
