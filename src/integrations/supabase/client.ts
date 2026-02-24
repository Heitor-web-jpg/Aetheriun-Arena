import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://example.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'anon';

export const supabase = createClient(url, key);
