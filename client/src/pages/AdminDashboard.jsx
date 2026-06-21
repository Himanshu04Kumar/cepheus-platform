import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutGrid, Clipboard, HardDrive, ShieldCheck, Play, 
  Loader2, Upload, AlertCircle, Sparkles, X, Check, 
  FileText, Clock, Camera, ArrowLeft, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Photo upload form states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [photoStage, setPhotoStage] = useState('received');
  const [photoCaption, setPhotoCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Kanban Lane Configuration
  const lanes = [
    { id: 'intake', label: 'Intake', statuses: ['new', 'picked_up'], transitionStatus: 'new' },
    { id: 'diagnosis', label: 'Diagnosis', statuses: ['diagnosing', 'awaiting_approval'], transitionStatus: 'diagnosing' },
    { id: 'repair', label: 'In-Repair', statuses: ['in_repair'], transitionStatus: 'in_repair' },
    { id: 'quality', label: 'Quality-Check', statuses: ['quality_check'], transitionStatus: 'quality_check' },
    { id: 'pickup', label: 'Ready-For-Pickup', statuses: ['out_for_delivery', 'delivered', 'warranty_active', 'cancelled'], transitionStatus: 'delivered' }
  ];

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get('http://localhost:5000/api/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        throw new Error('Failed to load bookings database.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to fetch admin data layers.');
      // Mocking backup data if server is unreached
      setBookings([
        {
          id: 'b1a2e3fc-1284-4487-821b-e2affe04669a',
          device_brand: 'Apple',
          device_model: 'MacBook Pro M3',
          status: 'new',
          issue_description: 'Battery drains rapidly under normal compiling loads. Health shows 71%.',
          repair_type: 'Battery Module Lifecycle Upgrade',
          final_price: 3200,
          created_at: new Date().toISOString(),
          customer: { full_name: 'Aditya Sen', email: 'aditya@example.com', phone: '9812345678' },
          repair_photos: []
        },
        {
          id: '01a3e3ec-1284-4487-821b-e2affe04669a',
          device_brand: 'Lenovo',
          device_model: 'ThinkPad X1 Carbon',
          status: 'diagnosing',
          issue_description: 'Keyboard keys G, H, and Backspace non-functional after coffee mist.',
          repair_type: 'Tactile Keyboard Array Overhaul',
          final_price: 4500,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          customer: { full_name: 'Ritika Gupta', email: 'ritika@example.com', phone: '9988776655' },
          repair_photos: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Native HTML5 Drag and Drop Handlers
  const handleDragStart = (e, bookingId) => {
    e.dataTransfer.setData('text/plain', bookingId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, laneId) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData('text/plain');
    const targetLane = lanes.find(l => l.id === laneId);
    if (!targetLane) return;

    const nextStatus = targetLane.transitionStatus;
    
    // Update local state first for immediate UI transition response
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: nextStatus } : b));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => ({ ...prev, status: nextStatus }));
    }

    try {
      await axios.patch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        status: nextStatus
      });
    } catch (err) {
      console.error('State sync update failed:', err);
      // Revert if error occurs
      fetchBookings();
    }
  };

  // Image Upload handler
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError('');
    setUploadSuccess(false);
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedBooking) {
      setUploadError('Please select a diagnostic file image first.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    const formDataToSend = new FormData();
    formDataToSend.append('image', selectedFile);
    formDataToSend.append('stage', photoStage);
    formDataToSend.append('caption', photoCaption);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/bookings/${selectedBooking.id}/upload-photo`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setUploadSuccess(true);
        setPhotoCaption('');
        setSelectedFile(null);
        // Refresh local details view
        const updatedPhoto = res.data.photo;
        const newPhotoItem = {
          stage: updatedPhoto.stage,
          photo_url: updatedPhoto.photo_url,
          caption: updatedPhoto.caption,
          uploaded_at: updatedPhoto.uploaded_at
        };

        setBookings(prev => prev.map(b => {
          if (b.id === selectedBooking.id) {
            const currentPhotos = b.repair_photos || [];
            return { ...b, repair_photos: [...currentPhotos, updatedPhoto] };
          }
          return b;
        }));

        setSelectedBooking(prev => ({
          ...prev,
          repair_photos: [...(prev.repair_photos || []), updatedPhoto]
        }));
      }
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.error || err.message || 'Failed to complete image upload pipeline.');
    } finally {
      setUploading(false);
    }
  };

  // Metric aggregates calculations
  const totalCount = bookings.length;
  const inDiagnosisCount = bookings.filter(b => b.status === 'diagnosing' || b.status === 'awaiting_approval').length;
  const inRepairCount = bookings.filter(b => b.status === 'in_repair').length;
  const completedCount = bookings.filter(b => b.status === 'delivered' || b.status === 'warranty_active').length;

  return (
    <div className="bg-bg-primary min-h-[calc(100vh-80px)] text-ink-primary selection:bg-accent selection:text-white font-sans">
      
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-[10px] uppercase tracking-[0.14em] text-ink-light hover:text-accent transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 font-medium"
            >
              <ArrowLeft size={10} className="mr-1.5" /> Back to Site
            </button>
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight leading-none">Admin Command Center</h1>
            <p className="text-xs text-ink-light font-light">Global dashboard matrix for real-time repair operations, telemetry, and diagnostics.</p>
          </div>
          
          <button 
            onClick={fetchBookings}
            className="flex items-center border border-half border-black/10 text-ink-mid px-4 py-2.5 rounded-subtle hover:bg-bg-secondary transition-colors cursor-pointer text-xs font-medium"
          >
            <RefreshCw size={12} className="mr-2" /> Reload Data
          </button>
        </div>

        {/* METRICS SUMMARY CARD CAROUSEL/GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total active Bookings', value: totalCount, icon: <Clipboard size={16} /> },
            { label: 'Currently in Diagnosis', value: inDiagnosisCount, icon: <Clock size={16} /> },
            { label: 'Active repair Bay', value: inRepairCount, icon: <Play size={16} /> },
            { label: 'Settled & Delivered', value: completedCount, icon: <ShieldCheck size={16} /> }
          ].map((metric, idx) => (
            <div key={idx} className="bg-bg-secondary/40 border border-half border-black/10 p-5 rounded-subtle space-y-3">
              <div className="flex justify-between items-center text-ink-light">
                <span className="text-[10px] uppercase tracking-wider font-medium">{metric.label}</span>
                {metric.icon}
              </div>
              <p className="font-serif text-3xl md:text-4xl text-ink-primary font-normal leading-none">{metric.value}</p>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 border border-half border-accent text-accent text-xs rounded-subtle font-medium bg-accent/5 max-w-[640px]">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-xs text-ink-light uppercase tracking-widest font-mono">Syncing Database Matrix...</p>
          </div>
        ) : (
          /* KANBAN OPERATIONAL BOARD */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto select-none items-start">
            {lanes.map((lane) => {
              const laneBookings = bookings.filter(b => lane.statuses.includes(b.status));

              return (
                <div 
                  key={lane.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, lane.id)}
                  className="bg-bg-secondary/20 border border-half border-black/10 rounded-subtle p-4 min-h-[500px] flex flex-col space-y-4"
                >
                  {/* Lane Header */}
                  <div className="flex justify-between items-center border-b border-half border-black/5 pb-3">
                    <h3 className="text-[10px] uppercase tracking-wider font-medium text-ink-primary">{lane.label}</h3>
                    <span className="bg-bg-secondary border border-half border-black/10 px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium text-ink-mid">
                      {laneBookings.length}
                    </span>
                  </div>

                  {/* Lane Cards Container */}
                  <div className="flex-grow flex flex-col space-y-3 overflow-y-auto">
                    {laneBookings.length === 0 ? (
                      <div className="flex-grow border border-dashed border-black/5 rounded-subtle flex items-center justify-center p-6 text-center text-[10px] text-ink-light uppercase tracking-wider">
                        Drop Cards Here
                      </div>
                    ) : (
                      laneBookings.map((booking) => (
                        <div
                          key={booking.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, booking.id)}
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-bg-primary border border-half border-black/10 p-4 rounded-subtle shadow-sm hover:border-accent hover:shadow-md transition-all duration-200 cursor-pointer space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] font-mono tracking-widest text-ink-light">
                              {booking.id.slice(-6).toUpperCase()}
                            </span>
                            <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold ${
                              booking.status === 'new' ? 'bg-accent/10 text-accent border border-half border-accent/20' :
                              booking.status === 'diagnosing' ? 'bg-amber-500/10 text-amber-600 border border-half border-amber-500/20' :
                              booking.status === 'awaiting_approval' ? 'bg-purple-500/10 text-purple-600 border border-half border-purple-500/20' :
                              booking.status === 'in_repair' ? 'bg-blue-500/10 text-blue-600 border border-half border-blue-500/20' :
                              booking.status === 'quality_check' ? 'bg-emerald-500/10 text-emerald-600 border border-half border-emerald-500/20' :
                              'bg-ink-mid/10 text-ink-mid border border-half border-black/10'
                            }`}>
                              {booking.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-ink-primary font-sans leading-tight">
                              {booking.device_brand} {booking.device_model}
                            </h4>
                            <p className="text-[10px] text-ink-mid font-light line-clamp-2 leading-relaxed">
                              {booking.issue_description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-ink-light pt-2 border-t border-half border-black/5 font-sans">
                            <span>{booking.customer?.full_name || 'Individual Client'}</span>
                            {booking.repair_photos && booking.repair_photos.length > 0 && (
                              <span className="flex items-center text-accent">
                                <Camera size={10} className="mr-1" />
                                {booking.repair_photos.length}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SIDE DETAIL DRAWER MODAL OVERLAY */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end animate-fade-in">
            
            <div className="w-full max-w-[560px] bg-bg-primary h-full border-l border-half border-black/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-half border-black/10 flex justify-between items-center bg-bg-secondary/40">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-ink-light font-mono block">Ticket Registry # {selectedBooking.id.slice(-8).toUpperCase()}</span>
                  <h2 className="font-serif text-2xl text-ink-primary">{selectedBooking.device_brand} {selectedBooking.device_model}</h2>
                </div>
                <button 
                  onClick={() => { setSelectedBooking(null); setUploadSuccess(false); setUploadError(''); }}
                  className="w-8 h-8 rounded-full border border-half border-black/10 flex items-center justify-center text-ink-mid hover:text-accent hover:border-accent cursor-pointer bg-transparent"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 flex-grow space-y-8">
                
                {/* 1. Client Info Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-ink-light font-semibold border-b border-half border-black/5 pb-1">Client Profile</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-ink-light font-light block mb-0.5">Name</span>
                      <span className="font-medium text-ink-primary">{selectedBooking.customer?.full_name || 'Not Available'}</span>
                    </div>
                    <div>
                      <span className="text-ink-light font-light block mb-0.5">Mobile Parameters</span>
                      <span className="font-medium font-mono text-ink-primary">{selectedBooking.customer?.phone || 'Not Available'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-ink-light font-light block mb-0.5">Email Address</span>
                      <span className="font-medium text-ink-primary">{selectedBooking.customer?.email || 'Not Available'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Repair Info Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-ink-light font-semibold border-b border-half border-black/5 pb-1">Operational Diagnostics</h4>
                  <div className="text-xs space-y-3 font-sans">
                    <div>
                      <span className="text-ink-light font-light block mb-0.5">Reported Technical Fault</span>
                      <p className="font-light text-ink-mid leading-relaxed bg-bg-secondary/30 border border-half border-black/5 p-3 rounded-sm">
                        {selectedBooking.issue_description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-ink-light font-light block mb-0.5">Repair Category</span>
                        <span className="font-medium text-ink-primary">{selectedBooking.repair_type}</span>
                      </div>
                      <div>
                        <span className="text-ink-light font-light block mb-0.5">Valuation Allocation</span>
                        <span className="font-mono font-medium text-accent">₹{selectedBooking.final_price || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Photos Gallery */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-ink-light font-semibold border-b border-half border-black/5 pb-1 flex items-center">
                    <Camera size={12} className="mr-1.5 text-accent"/> Visual Audit Records ({selectedBooking.repair_photos?.length || 0})
                  </h4>
                  
                  {selectedBooking.repair_photos && selectedBooking.repair_photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBooking.repair_photos.map((photo, pIdx) => (
                        <div key={pIdx} className="border border-half border-black/10 bg-bg-secondary/20 p-2.5 rounded-subtle space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono text-ink-light uppercase">
                            <span className="text-accent font-medium">{photo.stage}</span>
                          </div>
                          <img 
                            src={photo.photo_url} 
                            alt={photo.caption} 
                            className="w-full h-24 object-cover rounded-sm border border-half border-black/5 filter grayscale hover:grayscale-0 transition-all duration-300"
                          />
                          <p className="text-[10px] text-ink-mid font-light leading-normal truncate italic">
                            {photo.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-light font-light italic">No photographic evidence logged for this repair order yet.</p>
                  )}
                </div>

                {/* 4. Diagnostic Photo Upload Form */}
                <div className="bg-bg-secondary/40 border border-half border-black/10 p-5 rounded-subtle space-y-4">
                  <div className="flex items-center space-x-2 text-accent">
                    <Upload size={14} />
                    <h4 className="text-[10px] uppercase tracking-[0.14em] font-semibold">Upload Diagnostic Proof (WebP Auto-compressed)</h4>
                  </div>

                  {uploadError && (
                    <div className="p-3 border border-half border-accent text-accent text-[11px] rounded-subtle font-medium bg-accent/5">
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="p-3 border border-half border-emerald-500 text-emerald-600 text-[11px] rounded-subtle font-medium bg-emerald-500/5">
                      Photo compressed and uploaded successfully!
                    </div>
                  )}

                  <form onSubmit={handlePhotoUpload} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-ink-mid font-medium">Repair Phase Stage</label>
                        <select 
                          className="border border-half border-black/10 rounded-subtle bg-bg-primary px-3 py-2 text-xs outline-none focus:border-accent text-ink-primary font-light"
                          value={photoStage}
                          onChange={(e) => setPhotoStage(e.target.value)}
                        >
                          <option value="received">Received / Intake</option>
                          <option value="parts_removed">Teardown / Parts Removed</option>
                          <option value="diagnosis">Diagnosis / Analysis</option>
                          <option value="approval">Price Approval Gate</option>
                          <option value="parts_installed">Repaired / Parts Installed</option>
                          <option value="complete">Verification Complete</option>
                          <option value="quality_check">Quality Stress Check</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-ink-mid font-medium">Select Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="text-[10px] text-ink-mid file:mr-3 file:py-1.5 file:px-3 file:rounded-subtle file:border-none file:text-[10px] file:uppercase file:font-semibold file:bg-ink-primary file:text-white hover:file:bg-accent file:cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-ink-mid font-medium">Photo Caption / Note</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Solder corrosion detected near C3402 capacitor..."
                        className="border border-half border-black/10 rounded-subtle bg-bg-primary px-3 py-2 text-xs outline-none focus:border-accent text-ink-primary font-light"
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-accent text-white py-2.5 rounded-subtle hover:bg-ink-primary transition-colors cursor-pointer font-medium flex items-center justify-center text-xs uppercase tracking-wider border-none"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={12} className="animate-spin mr-2" /> Compressing WebP & Uploading...
                        </>
                      ) : 'Upload Photo Link'}
                    </button>
                  </form>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
      
    </div>
  );
}
