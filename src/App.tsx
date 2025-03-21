import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Background3D from './components/common/Background3D';
import LandingPage from './components/LandingPage';
import MainDashboard from './components/dashboard/MainDashboard';
import SeekersScreen from './pages/SeekersScreen';
import InspiratorsScreen from './pages/InspiratorsScreen';
import SuccessStoriesScreen from './pages/SuccessStoriesScreen';
import CommunitiesScreen from './pages/CommunitiesScreen';
import OpportunitiesScreen from './pages/OpportunitiesScreen';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { NovaProvider } from './contexts/NovaContext';

const App: React.FC = () => {
  return (
    <Router>
      <NovaProvider>
        <ProgressionProvider>
          <div className="min-h-screen">
            <Background3D />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/seekers" element={<SeekersScreen />} />
              <Route path="/inspirators" element={<InspiratorsScreen />} />
              <Route path="/success-stories" element={<SuccessStoriesScreen />} />
              <Route path="/communities" element={<CommunitiesScreen />} />
              <Route path="/opportunities" element={<OpportunitiesScreen />} />
            </Routes>
          </div>
        </ProgressionProvider>
      </NovaProvider>
    </Router>
  );
};

export default App; 