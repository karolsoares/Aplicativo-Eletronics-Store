// (Arquivo de configuração do Supabase - Inicializa o cliente Supabase para uso no aplicativo)
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// (URL e Chave Anônima do projeto Supabase fornecidas pelo usuário)
const supabaseUrl = "https://atwgkacscolturtpoboz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d2drYWNzY29sdHVydHBvYm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTcxMzksImV4cCI6MjA2NTkzMzEzOX0.oR_lsGH9i86bnakhYbKyXpUO3zVQWSSUFPH0cCkJvzQ";

// (Cria e exporta o cliente Supabase, configurando o AsyncStorage para persistência da sessão)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   realtime: { enabled: false }, // evita usar ws
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

