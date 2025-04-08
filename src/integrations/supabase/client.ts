
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ksrnoaltmiyuuvogvipd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzcm5vYWx0bWl5dXV2b2d2aXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTY0NzgsImV4cCI6MjA1OTU3MjQ3OH0.KIGHYnHfSGiuIb5BUe4EARdeZ88oID7JY1jFfWGZrLQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
