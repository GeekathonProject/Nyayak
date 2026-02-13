import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat"; // ✅ Chat added

// Contexts
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";

// Layouts & Protection
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* ================= PROTECTED ROUTES ================= */}
            {/* Wrapped with Auth check + Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<SafetyMap />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} /> {/* ✅ Chat route */}
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
