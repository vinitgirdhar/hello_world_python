import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import HealthData from './pages/HealthData';
import WaterQuality from './pages/WaterQuality';
import Community from './pages/Community';
import CommunityChat from './pages/CommunityChat';
import Map from './pages/Map';
import Gallery from './pages/Gallery';
import News from './pages/News';
import DiseaseMapping from './pages/DiseaseMapping';
import ASHACommunication from './pages/ASHACommunication';
import WaterQualityPrediction from './pages/WaterQualityPrediction';
import './App.css';
import './locales';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
          <Routes>
            {/* Public pages with special layouts */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Public pages with navbar and chatbot */}
            <Route path="/about" element={
              <PublicLayout>
                <About />
              </PublicLayout>
            } />
            <Route path="/contact" element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            } />
            <Route path="/map" element={
              <PublicLayout>
                <Map />
              </PublicLayout>
            } />
            <Route path="/gallery" element={
              <PublicLayout>
                <Gallery />
              </PublicLayout>
            } />
            <Route path="/news" element={
              <PublicLayout>
                <News />
              </PublicLayout>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Layout type="dashboard">
                  <CommunityChat />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/report-symptoms" element={
              <PublicLayout>
                <Community />
              </PublicLayout>
            } />
            <Route path="/disease-mapping" element={
              <ProtectedRoute requiredRole={["healthcare_worker", "asha_worker", "district_health_official", "government_body"]}>
                <Layout type="dashboard">
                  <DiseaseMapping />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/asha-communication" element={
              <ProtectedRoute requiredRole={["healthcare_worker", "asha_worker", "district_health_official", "government_body"]}>
                <Layout type="dashboard">
                  <ASHACommunication />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-prediction" element={
              <ProtectedRoute requiredRole={["healthcare_worker", "asha_worker", "district_health_official", "government_body", "volunteer"]}>
                <Layout type="dashboard">
                  <WaterQualityPrediction />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Protected dashboard pages */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout type="dashboard">
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/health" element={
              <ProtectedRoute requiredRole="health_worker">
                <Layout type="dashboard">
                  <HealthData />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/water-quality" element={
              <ProtectedRoute>
                <Layout type="dashboard">
                  <WaterQuality />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Other protected pages */}
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Layout type="dashboard">
                  <div>Alerts Page (Coming Soon)</div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/education" element={
              <PublicLayout>
                <div>Education Page (Coming Soon)</div>
              </PublicLayout>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requiredRole="admin">
                <Layout type="dashboard">
                  <div>Reports Page (Coming Soon)</div>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
