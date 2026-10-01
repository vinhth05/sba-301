import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import CategoryManagement from './pages/CategoryManagement';
import NewsManagement from './pages/NewsManagement';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import { dataService } from './services/dataService';

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user && user.role === 1 && user.status === 1) {
      setIsAuth(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setAuth={setIsAuth} />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AdminLayout setAuth={setIsAuth} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
