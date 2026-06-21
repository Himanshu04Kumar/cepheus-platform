import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookRepair from './pages/BookRepair';
import TrackRepair from './pages/TrackRepair';
import InstitutionalPartner from './pages/InstitutionalPartner';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary text-ink-primary selection:bg-accent selection:text-white">
        {/* Global Fixed Navigation Header wrapped in Router context */}
        <Navbar />
        
        {/* Active Page View Layer */}
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookRepair />} />
            <Route path="/track" element={<TrackRepair />} />
            <Route path="/institutional-partner" element={<InstitutionalPartner />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Catch-all fallback routing back to Homepage */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;