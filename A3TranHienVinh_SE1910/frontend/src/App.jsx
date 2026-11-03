/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OnlineBookingPage from './pages/OnlineBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Staff Pages
import StaffRoomsPage from './pages/staff/StaffRoomsPage';
import StaffCustomersPage from './pages/staff/StaffCustomersPage';
import StaffBookingsPage from './pages/staff/StaffBookingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderNav />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Protected Routes */}
            <Route
              path="/book"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <OnlineBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Staff Protected Routes */}
            <Route
              path="/staff/rooms"
              element={
                <ProtectedRoute requiredRole="STAFF">
                  <StaffRoomsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/customers"
              element={
                <ProtectedRoute requiredRole="STAFF">
                  <StaffCustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/bookings"
              element={
                <ProtectedRoute requiredRole="STAFF">
                  <StaffBookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

