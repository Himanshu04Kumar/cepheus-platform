import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookRepair from './pages/BookRepair';
import TrackRepair from './pages/TrackRepair';
import InstitutionalPartner from './pages/InstitutionalPartner';

function App() {
  // Simple, robust client-side routing matrix state
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigate={setCurrentPage} />;
      case 'book':
        return <BookRepair navigate={setCurrentPage} />;
      case 'track':
        return <TrackRepair navigate={setCurrentPage} />;
      case 'institutions':
        return <InstitutionalPartner navigate={setCurrentPage} />;
      default:
        return <Home navigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary selection:bg-accent selection:text-white">
      {/* Global Fixed Navigation Header */}
      <Navbar currentPage={currentPage} navigate={setCurrentPage} />
      
      {/* Active Page View Layer */}
      <main className="pt-20">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;