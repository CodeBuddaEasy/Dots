import React from 'react'
import ReactDOM from 'react-dom/client'

// Load environment variables first, before any other imports
import './utils/envLoader';

import App from './App.tsx'
import './index.css'
import { checkEnvironmentVariables } from './utils/envCheck.ts'

// Check environment variables on app start
const envStatus = checkEnvironmentVariables();
console.log("Environment check complete:", envStatus);

// If OpenAI key is missing, show a more visible error
if (!envStatus.hasOpenAiKey) {
  console.error("============================================");
  console.error("ERROR: OpenAI API key is missing!");
  console.error("Make sure your .env file contains VITE_OPENAI_API_KEY");
  console.error("Restart the development server after updating the .env file");
  console.error("============================================");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 