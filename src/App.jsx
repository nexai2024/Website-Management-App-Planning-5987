import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddWebsite from './pages/AddWebsite';
import WebsiteDetail from './pages/WebsiteDetail';
import EditWebsite from './pages/EditWebsite';
import Domains from './pages/Domains';
import DomainDetail from './pages/DomainDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import Onboarding from './pages/Onboarding';
import Account from './pages/Account';
import Pricing from './pages/Pricing';
import { WebsiteProvider } from './context/WebsiteContext';
import { SupabaseProvider } from './context/SupabaseContext';
import { useSupabase } from './context/SupabaseContext';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSupabase();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useSupabase();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/pricing" element={<Pricing />} />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddWebsite /></ProtectedRoute>} />
      <Route path="/website/:id" element={<ProtectedRoute><WebsiteDetail /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><EditWebsite /></ProtectedRoute>} />
      <Route path="/domains" element={<ProtectedRoute><Domains /></ProtectedRoute>} />
      <Route path="/domain/:id" element={<ProtectedRoute><DomainDetail /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <SupabaseProvider>
      <WebsiteProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </WebsiteProvider>
    </SupabaseProvider>
  );
}

export default App;