import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, ArrowRight, ArrowLeft, Loader2, CreditCard } from 'lucide-react';

// Extract base routing URL from your environment configuration, default to local port 5000 if blank
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BookRepair() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingId, setBookingId] = useState('');

  // Centralized Matrix Tracking Form Properties
  const [formData, setFormData] = useState({
    deviceType: 'Laptop',
    brand: 'Dell',
    model: '',
    issueDescription: '',
    selectedRepairs: [],
    customRepair: '',
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pinCode: '',
    pickupZone: 'Central Delhi',
    pickupDate: '',
    pickupSlot: 'Morning 9–12'
  });

  const repairTiers = [
    { id: 'screen', label: 'Screen Panel Replacement', price: '₹2,000 - ₹8,000' },
    { id: 'battery', label: 'Battery Lifecycle Upgrade', price: '₹1,200 - ₹4,500' },
    { id: 'keyboard', label: 'Tactile Keyboard Array Overhaul', price: '₹1,500 - ₹5,500' },
    { id: 'port', label: 'Charging Input / Logic Port Servicing', price: '₹800 - ₹3,000' },
    { id: 'performance', label: 'OS optimization / Slow Performance', price: '₹500 - ₹1,500' },
    { id: 'other', label: 'Other Complex Issue / Diagnostic', price: '₹500 Fixed Diagnostic Fee' }
  ];

  const zones = ['North Delhi', 'South Delhi', 'West Delhi', 'East Delhi', 'Central Delhi', 'Rohini / Dwarka Sub-zones'];
  const timeSlots = ['Morning 9–12', 'Afternoon 12–4', 'Evening 4–7'];

  const handleModelBlur = async () => {
    if (!formData.model || !formData.brand) return;
    try {
      await axios.post(`${API_BASE_URL}/api/sheets/log-blur`, {
        brand: formData.brand,
        model: formData.model,
        issueDescription: formData.issueDescription || "Initial Field Blur Check",
        pickupZone: formData.pickupZone
      });
      console.log('📡 [Sheets Engine] Telemetry mirrored silently on blur.');
    } catch (err) {
      console.warn('Sheets telemetry skipped:', err.message);
    }
  };

  const handleToggleRepair = (id) => {
    setFormData(prev => {
      const current = prev.selectedRepairs;
      const updated = current.includes(id) ? current.filter(r => r !== id) : [...current, id];
      return { ...prev, selectedRepairs: updated };
    });
  };

  const validateStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.model.trim()) {
        setErrorMsg('Please specify your exact device model identifier.');
        return false;
      }
    }
    if (step === 2) {
      if (formData.selectedRepairs.length === 0) {
        setErrorMsg('Please select at least one repair classification layer.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.pinCode.trim() || !formData.pickupDate) {
        setErrorMsg('All contact identity, primary address lines, PIN codes, and timeline slots are mandatory.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMsg('Please enter a valid structural email address.');
        return false;
      }
      const phoneClean = formData.phone.replace(/\D/g, '');
      if (phoneClean.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (formData.addressLine1.trim().length < 6) {
        setErrorMsg('Please provide a specific Flat/House/Building number in Address Line 1.');
        return false;
      }
      const pinClean = formData.pinCode.replace(/\D/g, '');
      if (pinClean.length !== 6 || !pinClean.startsWith('11')) {
        setErrorMsg('Please provide a valid 6-digit Delhi PIN code (e.g., 110001) starting with 11.');
        return false;
      }
      const selectedDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setErrorMsg('The preferred pickup date cannot sit in the past.');
        return false;
      }
      if (selectedDate.getDay() === 0) {
        setErrorMsg('Cepheus operations are closed on Sundays.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const executePaymentGatewayLoop = async () => {
    setErrorMsg('');
    setLoading(true);
    const composedAddress = `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}${formData.landmark ? ' (Landmark: ' + formData.landmark + ')' : ''}, PIN: ${formData.pinCode}`;
    try {
      const initResponse = await axios.post(`${API_BASE_URL}/api/bookings/initialize`, {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        amount: 199,
        deviceBrand: formData.brand,
        deviceModel: formData.model,
        issueDescription: formData.issueDescription,
        repairType: formData.selectedRepairs.map(r => repairTiers.find(t => t.id === r)?.label).join(', '),
        pickupAddress: composedAddress,
        pickupZone: formData.pickupZone,
        pickupDate: formData.pickupDate,
        pickupSlot: formData.pickupSlot
      });

      if (!initResponse.data.success) throw new Error(initResponse.data.error || 'Initialization vector failed.');

      const { orderId, amountInPaise, currency, userId } = initResponse.data;
      const gatewayOptions = {
        key: "rzp_test_Sqy8PEJ1MvmIO",
        amount: amountInPaise,
        currency: currency,
        name: "Cepheus",
        description: "Secure Digital Slot Reservation Booking Fee",
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await axios.post(`${API_BASE_URL}/api/webhooks/razorpay`, {
              event: "payment.captured",
              payload: {
                payment: {
                  entity: {
                    id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    amount: amountInPaise,
                    currency: currency,
                    notes: {
                      customerId: userId,
                      deviceBrand: formData.brand,
                      deviceModel: formData.model,
                      issueDescription: formData.issueDescription,
                      repairType: formData.selectedRepairs.map(r => repairTiers.find(t => t.id === r)?.label).join(', '),
                      pickupAddress: composedAddress,
                      pickupZone: formData.pickupZone,
                      pickupDate: formData.pickupDate,
                      pickupSlot: formData.pickupSlot
                    }
                  }
                }
              }
            });

            if (verifyRes.status === 200) {
              setBookingId(`CPH-${Date.now().toString().slice(-6).toUpperCase()}`);
              setStep(5);
            } else {
              throw new Error('Transaction execution signature check failure.');
            }
          } catch (vErr) {
            setErrorMsg(`Verification Breakpoint Exception: ${vErr.message}`);
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#c8440a" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzpWindowInstance = new window.Razorpay(gatewayOptions);
      rzpWindowInstance.open();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Fatal operational pipeline runtime exception.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {step < 5 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold">Step 0{step} of 04</span>
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-ink-primary">
            {step === 1 && 'Hardware Parameters'}
            {step === 2 && 'Diagnostic Classification'}
            {step === 3 && 'Logistics Infrastructure'}
            {step === 4 && 'Ledger Verification'}
          </h1>
        </div>
      )}

      {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-subtle">{errorMsg}</div>}

      {/* STEP 1: PARAMETERS CONFIG */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Device Vector Classification</label>
              <select className="border border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none" value={formData.deviceType} onChange={(e) => setFormData({...formData, deviceType: e.target.value})}>
                <option>Laptop</option><option>Desktop</option><option>Tablet</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Hardware Brand Alignment</label>
              <select className="border border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}>
                <option>Dell</option><option>HP</option><option>Lenovo</option><option>Apple</option><option>Asus</option><option>Acer</option><option>Other</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Model Code Identifier</label>
              <input type="text" className="border border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} onBlur={handleModelBlur} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Operational Issue Description</label>
              <textarea className="border border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none" rows="3" value={formData.issueDescription} onChange={(e) => setFormData({...formData, issueDescription: e.target.value})} />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CLASSIFICATION SCHEMES */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {repairTiers.map((tier) => (
              <div key={tier.id} onClick={() => handleToggleRepair(tier.id)} className={`border rounded-subtle p-4 flex items-center justify-between cursor-pointer transition-all ${formData.selectedRepairs.includes(tier.id) ? 'border-accent bg-accent/[0.02]' : 'border-black/10'}`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-ink-primary">{tier.label}</h4>
                  <p className="text-[10px] text-ink-light font-mono">{tier.price}</p>
                </div>
                {formData.selectedRepairs.includes(tier.id) && <Check size={14} className="text-accent" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: LOGISTICS ENGINES */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="border border-black/10 rounded-subtle px-4 py-3 text-xs" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="tel" placeholder="Phone" className="border border-black/10 rounded-subtle px-4 py-3 text-xs" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="Email Address" className="border border-black/10 rounded-subtle px-4 py-3 text-xs sm:col-span-2" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="Address Line 1" className="border border-black/10 rounded-subtle px-4 py-3 text-xs sm:col-span-2" value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} />
            <input type="text" placeholder="Address Line 2 (Optional)" className="border border-black/10 rounded-subtle px-4 py-3 text-xs sm:col-span-2" value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} />
            <input type="text" placeholder="Landmark (Optional)" className="border border-black/10 rounded-subtle px-4 py-3 text-xs sm:col-span-2" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} />
            <input type="text" placeholder="PIN Code" className="border border-black/10 rounded-subtle px-4 py-3 text-xs" value={formData.pinCode} onChange={(e) => setFormData({...formData, pinCode: e.target.value})} />
            <select className="border border-black/10 rounded-subtle px-4 py-3 text-xs" value={formData.pickupZone} onChange={(e) => setFormData({...formData, pickupZone: e.target.value})}>
              {zones.map((z, idx) => <option key={idx}>{z}</option>)}
            </select>
            <input type="date" className="border border-black/10 rounded-subtle px-4 py-3 text-xs" value={formData.pickupDate} onChange={(e) => setFormData({...formData, pickupDate: e.target.value})} />
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              {timeSlots.map((slot, idx) => (
                <button key={idx} type="button" onClick={() => setFormData({...formData, pickupSlot: slot})} className={`border p-2 rounded-subtle text-[10px] transition-colors ${formData.pickupSlot === slot ? 'border-accent bg-accent/5' : 'border-black/10'}`}>
                  {slot.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: LEDGER PREVIEW */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="border border-black/10 bg-bg-primary rounded-subtle divide-y divide-black/5 text-xs">
            <div className="p-4 flex justify-between"><span className="text-ink-light">Machine</span><span className="font-medium">{formData.brand} {formData.model}</span></div>
            <div className="p-4 flex justify-between"><span className="text-ink-light">Schedule</span><span className="font-medium">{formData.pickupDate} [{formData.pickupSlot}]</span></div>
            <div className="p-4 flex justify-between"><span className="text-ink-light">Zone Selection</span><span className="font-medium">{formData.pickupZone}</span></div>
            <div className="p-4 flex justify-between text-accent font-bold"><span className="text-ink-light">Booking Fee Deposit</span><span>₹199.00</span></div>
          </div>
        </div>
      )}

      {/* STEP 5: GATEWAY TRANSACTION COMPLETE */}
      {step === 5 && (
        <div className="space-y-6 text-center py-6 animate-pulse">
          <div className="w-12 h-12 bg-accent/10 border border-accent text-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-3xl tracking-tight text-ink-primary">You're booked.</h2>
            <p className="text-xs text-ink-light font-light max-w-[420px] mx-auto">
              Your transaction ledger allocation has cleared successfully. The hardware intake routing sequence is officially initialized.
            </p>
          </div>

          <div className="bg-bg-primary border border-black/10 p-6 rounded-subtle max-w-[320px] mx-auto">
            <span className="text-[9px] uppercase tracking-widest text-ink-light block mb-1">Tracking Ledger Hash ID</span>
            <span className="font-serif text-2xl text-accent tracking-wide block font-mono">{bookingId}</span>
          </div>

          <div className="pt-4 flex justify-center gap-3 text-xs uppercase tracking-wider font-sans font-medium">
            <button 
              onClick={() => navigate('/track')}
              className="bg-accent text-white px-5 py-3 rounded-subtle hover:bg-ink-primary transition-colors cursor-pointer"
            >
              Track My Repair
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROL NAVIGATION LAYER */}
      {step < 5 && (
        <div className="mt-8 flex justify-between text-xs uppercase tracking-widest font-medium">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button onClick={nextStep} className="flex items-center gap-2 text-accent">Continue <ArrowRight size={14} /></button>
          ) : (
            <button onClick={executePaymentGatewayLoop} disabled={loading} className="bg-accent text-white px-6 py-3 rounded-subtle disabled:opacity-50 flex items-center gap-2">
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Processing...</>
              ) : (
                <><CreditCard size={14} /> Pay ₹199</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}