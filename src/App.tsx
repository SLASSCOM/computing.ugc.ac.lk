import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProgramsPage from './components/ProgramsPage';
import AboutPage from './components/AboutPage';
import StatsPage from './components/StatsPage';
import AnalysisPage from './components/AnalysisPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const showAnalysis = import.meta.env.VITE_ENABLE_ANALYSIS_PAGE === 'true';

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-ugc-cream">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/stats" element={<StatsPage />} />
            {showAnalysis && <Route path="/analysis" element={<AnalysisPage />} />}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
