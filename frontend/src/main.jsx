import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// REMOVED: BrowserRouter, Routes, LandingPage, ThemeProvider, Login
// Why? Because App.jsx already handles them. Don't double-import!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)