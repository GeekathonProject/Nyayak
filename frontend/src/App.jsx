import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/themeContext'; // Check casing!
import { AuthProvider } from './context/Authcontext';   // Check casing!
import SignupPage from './pages/SignupPage';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login'; // Use the file name I gave you: LoginPage.jsx

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;