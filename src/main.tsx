import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error handling for initialization
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  createRoot(rootElement).render(<App />);
  console.log("Application started successfully");
} catch (error) {
  console.error("Failed to start application:", error);
}
