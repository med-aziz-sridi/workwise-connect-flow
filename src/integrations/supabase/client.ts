
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gwtdfnuuopcpsaieiqjm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dGRmbnV1b3BjcHNhaWVpcWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0OTM2MzMsImV4cCI6MjA1OTA2OTYzM30.w6LtdplP-04pxCkwYjjpb4x1cO0RaGEukJCsVK3YXJ4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
