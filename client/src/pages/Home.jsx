import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, ShieldCheck, Eye, Layers, Clock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const steps = [
    { num: 'I', title: 'Book Online', desc: 'Provide device metrics, log the specific performance issue, and pick a preferred diagnostic window.' },
    { num: 'II', title: 'Doorstep Pickup', desc: 'Our technician collects your machine right from your location, creating an onboarding visual report on arrival.' },
    { num: 'III', title: 'Transparent Repair', desc: 'Track step-by-step diagnostic photos in real-time. We never pass modifications or costs without your explicit gate approval.' },
    { num: 'IV', title: 'Delivered with Warranty', desc: 'Receive your laptop back at your desk with an automated tracking ledger receipt and a secure hardware coverage countdown.' }
  ];

  const pricing = [
    { service: 'Screen Panel Replacement', compatible: '₹2,000 – ₹4,500', original: '₹4,000 – ₹8,000' },
    { service: 'Battery Module Lifecycle Swaps', compatible: '₹1,200 – ₹2,500', original: '₹2,500 – ₹4,500' },
    { service: 'Tactile Keyboard Array Overhaul', compatible: '₹1,500 – ₹3,000', original: '₹3,000 – ₹5,500' },
    { service: 'Charging Input / Logic Port Servicing', compatible: '₹800 – ₹1,500', original: '₹1,500 – ₹3,000' },
    { service: 'Advanced Diagnostic Assessment', compatible: '₹500 (Adjusted Against Final Invoice)', original: '₹500 (Adjusted Against Final Invoice)' }
  ];

  const zones = ['North Delhi', 'South Delhi', 'West Delhi', 'East Delhi', 'Central Delhi', 'Rohini / Dwarka Sub-zones'];

  return (
    <div className="bg-bg-primary min-h-screen selection:bg-accent selection:text-white">
      
      {/* SECTION: HERO ENTRY LAYER */}
      <section className="relative min-h-[calc(100vh-80px)] max-w-[1200px] mx-auto px-6 flex flex-col justify-center overflow-hidden">
        {/* Decorative Pure CSS Geometric Circular Lines */}
        <div className="absolute top-10 right-0 w-[350px] h-[350px] border border-half border-black/5 rounded-full pointer-events-none hidden lg:block" />
        <div className="absolute top-20 right-10 w-[200px] h-[200px] border border-half border-accent/10 rounded-full pointer-events-none hidden lg:block" />
        
        <div className="max-w-[760px] space-y-6 z-10">
          <p className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium">
            Cepheus
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-ink-primary tracking-tight leading-[1.08]">
            Repair, <span className="italic text-accent font-normal">reimagined.</span>
          </h1>
          <p className="font-sans text-ink-mid text-base md:text-lg font-light leading-relaxed max-w-[620px]">
            Transparent laptop restoration frameworks operating across Delhi. Pre-approved pricing dynamics, granular cryptographic tracking records, and photographic step-by-step accountability. No surprise line-items.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.14em] font-sans font-medium">
            <button 
              onClick={() => navigate('/book')}
              className="bg-accent text-white px-6 py-4 rounded-subtle hover:bg-ink-primary transition-colors duration-200 cursor-pointer"
            >
              Book a Repair
            </button>
            <button 
              onClick={() => navigate('/institutional-partner')}
              className="border border-half border-ink-primary text-ink-primary px-6 py-4 rounded-subtle hover:bg-ink-primary hover:text-white transition-colors duration-200 cursor-pointer"
            >
              For Institutions
            </button>
          </div>
        </div>

        {/* Bottom Left Minimalist Scroll Anchor Indicator */}
        <div className="absolute bottom-8 left-6 flex items-center space-x-3 text-[10px] uppercase tracking-[0.14em] text-ink-light font-sans font-medium">
          <span className="w-8 h-[0.5px] bg-ink-light" />
          <span>Scroll To Explore</span>
        </div>
      </section>

      {/* SECTION 01: HOW IT WORKS PIPELINE */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-32 border-t border-half border-black/10">
        <div className="flex items-center mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium whitespace-nowrap mr-4">
            01 — How It Works
          </h2>
          <div className="w-full h-[0.5px] bg-black/10" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-4">
              <div className="font-serif text-3xl text-accent/40 italic">{step.num}</div>
              <h3 className="font-sans font-medium text-sm text-ink-primary uppercase tracking-wider">{step.title}</h3>
              <p className="font-sans text-ink-mid text-xs font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 02: THE DARK THEME TRANSPARENCY PROMISE */}
      <section className="bg-bg-dark text-white py-20 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium whitespace-nowrap mr-4">
              02 — Our Promise
            </h2>
            <div className="w-full h-[0.5px] bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-serif text-3xl md:text-5xl tracking-tight leading-[1.15]">
                You observe everything. Every part. Every execution sequence. Before we process a single rupee.
              </h3>
              <p className="font-sans text-ink-light text-xs font-light leading-relaxed">
                We reject opaque backend technician bays. Every teardown configuration is recorded, timestamped, and instantly mounted directly onto your cryptographic public validation tracking timeline.
              </p>
            </div>

            {/* Simulated Live Visual Timeline Frame Matrix */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Device Received', desc: 'Secure macro hardware audit on intake.', icon: <Smartphone size={16} /> },
                { label: 'Parts Documented', desc: 'Component teardown micro snapshot mapping.', icon: <Layers size={16} /> },
                { label: 'Your Approval Gate', desc: 'Dynamic digital cost authorization dashboard.', icon: <Eye size={16} /> },
                { label: 'System Complete', desc: 'Post-repair automated stress validation cycles.', icon: <ShieldCheck size={16} /> }
              ].map((card, i) => (
                <div key={i} className="bg-bg-dark border border-half border-white/10 p-6 rounded-subtle space-y-4 hover:border-accent/40 transition-colors duration-300">
                  <div className="flex items-center justify-between text-accent">
                    {card.icon}
                    <span className="text-[9px] font-mono tracking-widest text-ink-light">ST_0{i+1}</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-xs uppercase tracking-wider text-white mb-1">{card.label}</h4>
                    <p className="font-sans text-[11px] text-ink-light font-light leading-normal">{card.desc}</p>
                  </div>
                  <div className="h-20 w-full bg-white/5 rounded-sm border border-half border-white/5 flex items-center justify-center text-[10px] tracking-widest font-mono text-white/20 uppercase">
                    [ Micro-Photo Frame ]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: SUPPORTED DEVICE METRIC TAGS */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-half border-black/10">
        <div className="flex items-center mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium whitespace-nowrap mr-4">
            03 — Scope Of Support
          </h2>
          <div className="w-full h-[0.5px] bg-black/10" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-serif text-2xl tracking-tight text-ink-primary max-w-[320px]">
            Operating exclusively across global computing fleets.
          </p>
          <div className="flex flex-wrap gap-2 max-w-[600px]">
            {['Apple MacBook', 'HP Envy / Pavilion', 'Dell XPS / Inspiron', 'Lenovo ThinkPad', 'Asus ROG / ZenBook', 'Acer Aspire'].map((brand, bIdx) => (
              <span key={bIdx} className="border border-half border-black/10 font-sans text-xs font-light px-4 py-2 rounded-subtle bg-bg-secondary text-ink-mid">
                {brand}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-wider font-sans text-ink-light mt-6 font-medium">
          * Expanded platform deployment pipelines (Tablets, Enterprise Displays, Fleet Monitors) arriving Q3 2026.
        </p>
      </section>

      {/* SECTION 04: ACCOUNTING TRANSPARENCY PRICING MATRICES */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-half border-black/10">
        <div className="flex items-center mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium whitespace-nowrap mr-4">
            04 — Standard Pricing Ranges
          </h2>
          <div className="w-full h-[0.5px] bg-black/10" />
        </div>
        <p className="font-sans text-ink-light text-xs font-light max-w-[600px] mb-8">
          Note: All values show expected operational boundaries. The precise quotation is anchored directly inside your dynamic tracking dashboard following hardware diagnostics, and execution strictly awaits your approval token.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-half border-black/20 text-[10px] uppercase tracking-wider font-medium text-ink-light">
                <th className="py-4 font-medium">Repair Category Classification</th>
                <th className="py-4 font-medium">Compatible Tier Components</th>
                <th className="py-4 font-medium">OEM Certified Original Array</th>
              </tr>
            </thead>
            <tbody className="font-light divide-y divide-black/5 text-ink-mid">
              {pricing.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-bg-secondary/40 transition-colors">
                  <td className="py-4 pr-4 font-medium text-ink-primary">{row.service}</td>
                  <td className="py-4 font-mono">{row.compatible}</td>
                  <td className="py-4 font-mono text-accent">{row.original}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 05: OPERATIONAL DISTRICT BOUNDARIES */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-half border-black/10">
        <div className="flex items-center mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.14em] text-accent font-sans font-medium whitespace-nowrap mr-4">
            05 — Service Demographics
          </h2>
          <div className="w-full h-[0.5px] bg-black/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <h3 className="font-serif text-2xl tracking-tight mb-4">Active Delhi Coverage Matrix</h3>
            <p className="font-sans text-ink-mid text-xs font-light leading-relaxed">
              Our direct tracking pickup agents operate localized collection cycles daily across all primary coordinates listed.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-xs font-light text-ink-mid">
            {zones.map((zone, zIdx) => (
              <div key={zIdx} className="flex items-center space-x-2 py-2 border-b border-half border-black/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{zone}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* WhatsApp Floating Utility Bar Section */}
        <div className="mt-12 bg-bg-secondary border border-half border-black/10 p-6 rounded-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-sans text-xs text-ink-mid font-light">
            Outside our active geographic boundary coordinates? Chat with an operations manager instantly.
          </p>
          <a 
            href="https://wa.me/919999999999?text=Hi,%20my%20location%20falls%20outside%20the%20listed%20service%20zones.%20Can%20you%20assist?"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-half border-ink-primary text-ink-primary px-4 py-2 rounded-subtle text-xs font-medium uppercase tracking-wider hover:bg-ink-primary hover:text-white transition-colors"
          >
            Connect via WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER ACROSS SYSTEM FRAME */}
      <footer className="border-t border-half border-black/10 bg-bg-secondary py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 font-sans text-[11px] text-ink-light uppercase tracking-wider font-medium">
          <div className="font-serif text-sm tracking-tight text-ink-primary normal-case font-normal">Cepheus</div>
          <div className="flex space-x-6">
            <button onClick={() => navigate('/')} className="hover:text-accent cursor-pointer bg-transparent border-none p-0 text-[11px] uppercase tracking-wider font-medium text-ink-light">Terms</button>
            <button onClick={() => navigate('/track')} className="hover:text-accent cursor-pointer bg-transparent border-none p-0 text-[11px] uppercase tracking-wider font-medium text-ink-light">Track Link</button>
            <button onClick={() => navigate('/admin')} className="hover:text-accent cursor-pointer bg-transparent border-none p-0 text-[11px] uppercase tracking-wider font-medium text-ink-light">Admin Panel</button>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a>
          </div>
          <div>© Cepheus · {new Date().getFullYear()}</div>
        </div>
      </footer>

    </div>
  );
}