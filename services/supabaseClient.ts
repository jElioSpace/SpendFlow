
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztwleirmnqupovyjgbsd.supabase.co';
const supabaseAnonKey = 'sb_publishable_b7oNwatbvcCG28UxGwJ7tg_8Xd1NKB2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
