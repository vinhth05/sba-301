import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import PublicNews from './pages/PublicNews';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountManagement from './pages/AccountManagement';
import CategoryManagement from './pages/CategoryManagement';
import NewsManagement from './pages/NewsManagement';
import StaffProfile from './pages/StaffProfile';
import StaffHistory from './pages/StaffHistory';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light-subtle">
          <AppNavbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<PublicNews />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Shared Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes (Role = 1) */}
              <Route
                path="/admin/accounts"
                element={
                  <ProtectedRoute requiredRole={1}>
                    <AccountManagement />
                  </ProtectedRoute>
                }
              />

              {/* Staff Only Routes (Role = 2) */}
              <Route
                path="/staff/categories"
                element={
                  <ProtectedRoute requiredRole={2}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/news"
                element={
                  <ProtectedRoute requiredRole={2}>
                    <NewsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/profile"
                element={
                  <ProtectedRoute requiredRole={2}>
                    <StaffProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/my-history"
                element={
                  <ProtectedRoute requiredRole={2}>
                    <StaffHistory />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
