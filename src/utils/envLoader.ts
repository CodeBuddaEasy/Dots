/**
 * Utility to manually load environment variables
 */

interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_AI_PERSONALITY_CONFIG: string;
  VITE_PROGRESSION_SYSTEM_CONFIG: string;
}

type EnvKeys = keyof ImportMetaEnv;
type WindowEnvKeys = { [K in EnvKeys as `ENV_${K}`]: string };

// Extend the global Window interface
declare global {
  interface Window extends WindowEnvKeys {}
}

// Store loaded values with type safety
const loadedVars: Partial<ImportMetaEnv> = {};

// Function to read .env file and set values
export const loadEnvVariables = () => {
  console.log('Loading Dots platform environment configuration...');
  
  // Define fallback values for critical variables
  const fallbacks: ImportMetaEnv = {
    VITE_OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
    VITE_SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
    VITE_SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
    VITE_AI_PERSONALITY_CONFIG: JSON.stringify({
      name: 'Nova',
      personality: 'empathetic, inspiring, and growth-oriented',
      traits: ['adaptive', 'encouraging', 'insightful']
    }),
    VITE_PROGRESSION_SYSTEM_CONFIG: JSON.stringify({
      levels: 100,
      experienceMultiplier: 1.5,
      achievementCategories: ['Skills', 'Impact', 'Collaboration', 'Innovation']
    })
  };
  
  // Check if environment variables are set in import.meta.env
  console.log('Initializing Dots platform configuration...');
  for (const [key, value] of Object.entries(fallbacks)) {
    const envKey = key as keyof ImportMetaEnv;
    const currentValue = (import.meta.env as Partial<ImportMetaEnv>)[envKey];
    console.log(`${key}: ${currentValue ? 'Configured' : 'Using default configuration'}`);
    
    // If missing, set the fallback value
    if (!currentValue) {
      console.log(`Applying default configuration for ${key}`);
      loadedVars[envKey] = value;
      
      // Attempt to patch import.meta.env
      try {
        (import.meta.env as Partial<ImportMetaEnv>)[envKey] = value;
      } catch (e) {
        console.error(`Configuration error: Could not set ${key} in environment`);
      }
      
      // Set in window object for global access
      try {
        const windowKey = `ENV_${key}` as keyof WindowEnvKeys;
        window[windowKey] = value;
      } catch (e) {
        console.error(`Configuration error: Could not set ${key} in global scope`);
      }
    }
  }
  
  return loadedVars;
};

// Type-safe environment variable getter
export const getEnvVar = <T extends keyof ImportMetaEnv>(key: T): string => {
  // Try getting from import.meta.env first
  const metaValue = (import.meta.env as Partial<ImportMetaEnv>)[key];
  if (metaValue) return metaValue;
  
  // Try getting from our loaded values
  if (loadedVars[key]) return loadedVars[key]!;
  
  // Try getting from window object
  const windowKey = `ENV_${key}` as keyof WindowEnvKeys;
  const windowValue = window[windowKey];
  if (windowValue) return windowValue;
  
  console.error(`Configuration error: ${key} not found in any scope`);
  return '';
};

// Initialize configuration on module import
loadEnvVariables(); 