/**
 * Utility to check if environment variables are properly loaded
 */

export const checkEnvironmentVariables = () => {
  console.log("Environment Variables Check:");
  
  // Check OpenAI API Key
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log("VITE_OPENAI_API_KEY:", openaiKey ? "✅ Present" : "❌ Missing");
  
  // Check Supabase configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "✅ Present" : "❌ Missing");
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseKey ? "✅ Present" : "❌ Missing");
  
  // Log all environment variables with VITE_ prefix (values censored for security)
  console.log("\nAll VITE_ Environment Variables:");
  Object.keys(import.meta.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      const value = import.meta.env[key];
      const displayValue = typeof value === 'string' 
        ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}` 
        : value;
      console.log(`${key}: ${displayValue}`);
    }
  });
  
  return {
    hasOpenAiKey: !!openaiKey,
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey
  };
}; 