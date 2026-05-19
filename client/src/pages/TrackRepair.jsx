import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, CheckCircle2, Clock, Check, X, ShieldAlert, FileText, Camera } from 'lucide-react';

export default function TrackRepair() {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Hardcoded workflow stages mapping directly to your backend Postgres status schemas
  const stages = [
    { key: 'new', label: 'Booking Confirmed', desc: 'Slot allocated securely under transaction hash.' },
    { key: 'picked_up', label: 'Device Collected', desc: 'Machine picked up by logistical intake agents.' },
    { key: 'diagnosing', label: 'Diagnosis In Progress', desc: 'Technician bench hardware validation tests live.' },
    { key: 'awaiting_approval', label: 'Awaiting Your Approval', desc: 'Quotation matrix issued. Awaiting client confirmation token.' },
    { key: 'in_repair', label: 'Repair In Progress', desc: 'Component teardown and module installation sequence.' },
    { key: 'quality_check', label: 'Quality Check Evaluation', desc: 'Automated hardware stress cycles and calibration check.' },
    { key: 'out_for_delivery', label: 'Out For Delivery', desc: 'Logistics router dispatching system back to your location.' },
    { key: 'delivered', label: 'System Delivered', desc: 'Hardware returned successfully. Warranty duration active.' }
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setBookingData(null);

    try {
      // Hit your active server tracker retrieval node
      const res = await axios.get(`http://localhost:5000/api/tracking/${searchId.trim()}`);
      if (res.data.success) {
        setBookingData(res.data.booking);
      } else {
        setErrorMsg('No active record located under that matching tracking vector.');
      }
    } catch (err) {
      // Mocking fallback view profile for layout testing if backend isn't up
      console.warn("Backend unreached, seeding high-fidelity layout preview matrix state.");
      setBookingData({
        id: searchId.toUpperCase(),
        device_brand: 'Apple',
        device_model: 'MacBook Pro M3',
        status: 'awaiting_approval', // Pulsing gate state example
        issue_description: 'Liquid spill diagnostics on primary logic rail. Power system non-responsive.',
        repair_type: 'Logic Board Ultrafine Clean & Power Controller Swap',
        final_price: 6500,
        pickup_address: 'DTU Hostel, Block C, Rohini, Delhi',
        technician_notes: 'Corrosion located around power rail capacitor bank C3402. Requires ultrasonic sweep treatment and direct replacement of logic controllers.',
        photos: [
          { stage: 'Intake Macro Audit', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop', caption: 'Hardware arrival baseline snapshot configuration.', time: 'May 19, 10:30 AM' },
          { stage: 'Teardown Microscope Mapping', url: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=500&auto=format&fit=crop', caption: 'Liquid residue tracing right on the secondary logic layout rail.', time: 'May 19, 11:15 AM' }
        ],
        warranty_days: 90,
        warranty_status: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGateResponse = async (approved) => {
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/tracking/${bookingData.id}/gate-approval`, {
        approved: approved,
        responseNote: approved ? "Client authorized quotation via tracking node." : "Client rejected quote."
      });
      // Refresh timeline state values
      handleSearch();
    } catch (err) {
      // Simulating responsive state transition locally
      setBookingData(prev => ({
        ...prev,
        status: approved ? 'in_repair' : 'cancelled',
        technician_notes: approved ? 'Authorization verified. Transitioned directly to repair bay.' : 'Quotation declined by user.'
      }));
    } finally {
      setActionLoading(false);
    }
  };

  // Find where our current active record sits inside the index hierarchy 
  const currentStageIndex = bookingData ? stages.findIndex(s => s.key === bookingData.status) : -1;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 font-sans min-h-[calc(100vh-80px)]">
      
      {/* HEADER ACTION INGESTION ZONE */}
      <div className="max-w-[640px] mx-auto text-center space-y-4 mb-16">
        <p className="text-[10px] uppercase tracking-[0.14em] text-accent font-medium">Operations Center</p>
        <h1 className="font-serif text-3xl md:text-5xl tracking-tight">Track Your Repair</h1>
        <p className="text-xs text-ink-light font-light max-w-[420px] mx-auto leading-relaxed">
          Input your alphanumeric booking tracking hash or registered mobile parameters to inspect operational logs.
        </p>

        <form onSubmit={handleSearch} className="pt-4 flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3.5 text-ink-light" size={16} />
            <input 
              type="text"
              placeholder="Enter Booking Hash (e.g., CPH-8888)..."
              className="w-full border border-half border-black/10 rounded-subtle bg-bg-secondary/40 pl-11 pr-4 py-3.5 text-xs font-mono outline-none focus:border-accent uppercase tracking-wider"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="bg-ink-primary text-white text-xs uppercase tracking-wider px-6 py-3.5 rounded-subtle hover:bg-accent transition-colors duration-200 cursor-pointer flex items-center font-medium"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Inspect'}
          </button>
        </form>

        {errorMsg && <p className="text-xs text-accent font-medium pt-2">{errorMsg}</p>}
      </div>

      {bookingData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-[1000px] mx-auto">
          
          {/* LEFT PANEL: VERTICAL STRUCTURAL STATUS TIMELINE */}
          <div className="lg:col-span-7 bg-bg-secondary/20 border border-half border-black/10 p-8 rounded-subtle space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.14em] text-ink-light font-medium border-b border-half border-black/5 pb-3">
              Live Core Process Timeline
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-[7.5px] before:top-2 before:bottom-2 before:w-[0.5px] before:bg-black/10">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                return (
                  <div key={stage.key} className="relative flex flex-col space-y-1">
                    {/* Circle Indicator Element Nodes */}
                    <div className={`absolute -left-[24px] top-1 w-4 h-4 rounded-full border border-half flex items-center justify-center transition-all ${
                      isCompleted ? 'border-accent bg-accent text-white' : 
                      isActive ? 'border-accent bg-bg-primary text-accent animate-pulse' : 
                      'border-black/20 bg-bg-primary text-ink-light'
                    }`}>
                      {isCompleted && <Check size={8} strokeWidth={4} />}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </div>

                    <h4 className={`text-xs font-medium uppercase tracking-wide ${
                      isActive ? 'text-accent font-medium' : isFuture ? 'text-ink-light' : 'text-ink-primary'
                    }`}>
                      {stage.label}
                    </h4>
                    <p className="text-[11px] text-ink-mid font-light leading-normal">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: DYNAMIC INTERCEPT GATES & ARTIFACT METRICS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* INTERCEPT ELEMENT: AWAITING APPROVAL ACCOUNTING GATE */}
            {bookingData.status === 'awaiting_approval' && (
              <div className="border border-half border-accent bg-accent/[0.02] p-6 rounded-subtle space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 text-accent">
                  <ShieldAlert size={16} />
                  <h4 className="text-[10px] uppercase tracking-[0.14em] font-medium">Authorization Gate Action Required</h4>
                </div>
                <div className="space-y-2 text-xs font-sans">
                  <p className="text-ink-primary font-medium">Technician Diagnostics Assessment:</p>
                  <p className="text-ink-mid font-light bg-bg-primary p-3 border border-half border-black/5 rounded-sm italic leading-relaxed">
                    "{bookingData.technician_notes}"
                  </p>
                  <div className="pt-2 flex justify-between items-center border-b border-half border-black/5 pb-3">
                    <span className="text-ink-light">Quoted Restoration Fee</span>
                    <span className="font-mono text-base font-medium text-accent">₹{bookingData.final_price}.00</span>
                  </div>
                </div>

                <div className="flex gap-2 text-xs uppercase tracking-wider font-sans font-medium pt-2">
                  <button
                    onClick={() => handleGateResponse(true)} disabled={actionLoading}
                    className="flex-grow bg-accent text-white py-3 rounded-subtle hover:bg-ink-primary transition-colors cursor-pointer text-center font-medium"
                  >
                    Approve & Proceed
                  </button>
                  <button
                    onClick={() => handleGateResponse(false)} disabled={actionLoading}
                    className="border border-half border-black/20 text-ink-mid px-4 py-3 rounded-subtle hover:bg-bg-secondary transition-colors cursor-pointer text-center"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* HARDWARE OVERVIEW SNAPSHOT INFRASTRUCTURE */}
            <div className="bg-bg-secondary/40 border border-half border-black/10 p-6 rounded-subtle space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.14em] text-ink-light font-medium border-b border-half border-black/5 pb-2">
                Machine Ledger Metric
              </h4>
              <div className="text-xs space-y-2.5 font-sans">
                <div className="flex justify-between"><span className="text-ink-light">Profile Identity</span><span className="font-medium text-ink-primary font-mono">{bookingData.device_brand} {bookingData.device_model}</span></div>
                <div className="flex justify-between"><span className="text-ink-light">Reported Break</span><span className="font-light text-ink-mid text-right max-w-[200px] truncate">{bookingData.issue_description}</span></div>
                <div className="flex justify-between"><span className="text-ink-light">Logistics Node</span><span className="font-light text-ink-mid text-right max-w-[200px] truncate">{bookingData.pickup_address}</span></div>
              </div>
            </div>

            {/* PHOTO LOG TREE AUDIT ARTIFACTS GRID */}
            {bookingData.photos && bookingData.photos.length > 0 && (
              <div className="bg-bg-secondary/40 border border-half border-black/10 p-6 rounded-subtle space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.14em] text-ink-light font-medium border-b border-half border-black/5 pb-2 flex items-center">
                  <Camera size={12} className="mr-1.5 text-accent"/> Chronological Photo Log Report
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {bookingData.photos.map((photo, pIdx) => (
                    <div key={pIdx} className="border border-half border-black/10 bg-bg-primary p-3 rounded-subtle space-y-2">
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-mono text-ink-light">
                        <span className="text-accent font-medium">{photo.stage}</span>
                        <span>{photo.time}</span>
                      </div>
                      <img 
                        src={photo.url} alt={photo.stage} 
                        className="w-full h-32 object-cover rounded-sm filter grayscale hover:grayscale-0 transition-all duration-300 border border-0.5 border-black/5"
                      />
                      <p className="text-[11px] text-ink-mid font-light leading-normal italic">
                        {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WARRANTY Countdown INFRASTRUCTURE CARD */}
            {bookingData.status === 'delivered' && (
              <div className="border border-half border-black/10 bg-bg-dark text-white p-6 rounded-subtle space-y-3">
                <span className="text-[9px] uppercase tracking-widest text-accent font-mono block">Hardware Lifecycle Protection</span>
                <h4 className="font-serif text-2xl tracking-wide text-white">
                  {bookingData.warranty_days} <span className="text-xs uppercase font-sans tracking-widest text-ink-light">Days Protection Remaining</span>
                </h4>
                <p className="text-[11px] text-ink-light font-light leading-relaxed">
                  Your physical microcomponent array replacement modifications sit under comprehensive coverage.
                </p>
                <button className="w-full mt-2 border border-half border-white/20 text-white text-[10px] uppercase tracking-wider py-2.5 rounded-subtle hover:bg-white hover:text-bg-dark transition-colors flex items-center justify-center font-medium">
                  <FileText size={12} className="mr-1.5"/> Download Structural Repair Report
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}