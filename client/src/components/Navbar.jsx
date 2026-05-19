import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ currentPage, navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'How It Works' },
    { id: 'institutions', label: 'For Institutions' },
    { id: 'track', label: 'Track Repair' }
  ];

  const handleNav = (targetId) => {
    navigate(targetId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/92 backdrop-blur-md border-b border-half border-black/10 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Branding Logo - Cepheus */}
<button 
  onClick={() => handleNav('home')} 
  className="font-serif text-[18px] tracking-tight hover:text-accent transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-ink-primary font-normal"
>
  Cepheus
</button>

        {/* Desktop Navigation Link Cluster */}
        <div className="hidden md:flex items-center space-x-10 text-[10px] uppercase tracking-[0.14em] font-sans font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`hover:text-accent transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 font-medium ${
                currentPage === link.id ? 'text-accent' : 'text-ink-mid'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <button 
            onClick={() => handleNav('book')}
            className="border border-half border-accent text-accent px-4 py-2 rounded-subtle hover:bg-accent hover:text-white transition-colors duration-200 font-medium cursor-pointer text-[10px] uppercase tracking-[0.14em]"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Hamburger Trigger Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-ink-primary hover:text-accent transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Drawer Slide Overlay Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-bg-primary border-b border-half border-black/10 flex flex-col px-6 py-6 space-y-6 text-[10px] uppercase tracking-[0.14em] font-sans font-medium shadow-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="text-left py-2 border-b border-half border-black/5 text-ink-mid"
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => handleNav('book')}
            className="w-full text-center border border-half border-accent text-accent py-3 rounded-subtle bg-transparent font-medium"
          >
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}