import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddWebsite from './pages/AddWebsite';
import WebsiteDetail from './pages/WebsiteDetail';
import EditWebsite from './pages/EditWebsite';
import { WebsiteProvider } from './context/WebsiteContext';
import './App.css';

function App() {
  return (
    <WebsiteProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddWebsite />} />
              <Route path="/website/:id" element={<WebsiteDetail />} />
              <Route path="/edit/:id" element={<EditWebsite />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WebsiteProvider>
  );
}

export default App;