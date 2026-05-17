import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hertnvjoezewxuknucmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlcnRudmpvZXpld3h1a251Y216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MTM1NjYsImV4cCI6MjA5NDM4OTU2Nn0.pYVU79-_QkZVjomblQYkGHHeMbgKJppqLAJZ2Ueqf1Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);