/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_AI_PERSONALITY_CONFIG: string
  readonly VITE_PROGRESSION_SYSTEM_CONFIG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
