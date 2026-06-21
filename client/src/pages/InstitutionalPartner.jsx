import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, ShieldCheck, FileText, ArrowLeft, Loader2, ClipboardCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function InstitutionalPartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    fleetSize: ''
  });

  const valueProps = [
    {
      title: 'Enterprise SLAs & Priority Support',
      desc: 'Guaranteed 24-hour turnaround on critical diagnostic pipelines, minimizing hardware downtime for your workforce.',
      icon: <ShieldCheck className="text-accent" size={18} />
    },
    {
      title: 'Consolidated Monthly Ledger Invoicing',
      desc: 'Eliminate out-of-pocket employee expenses. Access a unified dashboard with transparent billing line-items.',
      icon: <FileText className="text-accent" size={18} />
    },
    {
      title: 'Audit-ready Cryptographic Timelines',
      desc: 'Every single repair teardown is documented with high-fidelity photo proof and logged permanently for IT audit compliance.',
      icon: <Building className="text-accent" size={18} />
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    setErrorMsg('');
    const { companyName, contactPerson, designation, email, phone, address, fleetSize } = formData;

    if (!companyName.trim() || !contactPerson.trim() || !designation.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('All organizational contact details, job designations, and addresses are mandatory.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid corporate email address.');
      return false;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid corporate telephone or mobile parameter.');
      return false;
    }

    if (fleetSize && (isNaN(fleetSize) || parseInt(fleetSize) <= 0)) {
      setErrorMsg('Fleet size must be a valid positive integer.');
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/institutions/onboard', {
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        fleetSize: formData.fleetSize || '0'
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        throw new Error(response.data.error || 'Failed to submit onboarding request.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Fatal exception submitting onboarding form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary min-h-[calc(100vh-80px)] selection:bg-accent selection:text-white font-sans">
      
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        
        {/* BACK NAVIGATION ANCHOR */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-[10px] uppercase tracking-[0.14em] text-ink-mid hover:text-accent transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 mb-10 font-medium"
        >
          <ArrowLeft size={12} className="mr-2" /> Back to Home
        </button>

        {success ? (
          /* SUCCESS SUBMISSION LAYER STATE */
          <div className="max-w-[640px] mx-auto bg-bg-secondary/40 border border-half border-black/10 p-10 rounded-subtle text-center space-y-6 my-10">
            <div className="w-14 h-14 bg-accent/10 border border-half border-accent text-accent rounded-full flex items-center justify-center mx-auto mb-2">
              <ClipboardCheck size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-3xl tracking-tight text-ink-primary">Application Received</h2>
              <p className="text-xs text-ink-mid font-light max-w-[460px] mx-auto leading-relaxed">
                Thank you. Your institutional fleet onboarding application has been successfully logged under the corporate tracking registry. 
              </p>
              <p className="text-xs text-ink-light font-light max-w-[420px] mx-auto leading-relaxed">
                A dedicated Cepheus Account Manager will coordinate with your IT Procurement Officer at <strong className="font-medium text-ink-primary">{formData.email}</strong> within 24 business hours to establish pricing bands and draft your custom SLA Memorandum of Understanding (MOU).
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => navigate('/')}
                className="bg-accent text-white text-xs uppercase tracking-wider px-6 py-3 rounded-subtle hover:bg-ink-primary transition-colors cursor-pointer font-medium border-none"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* MAIN ENTRY MULTIPART LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT HEADER & PROPOSITION DESCRIPTION COLUMN */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-accent font-medium">Partnership Tier</p>
                <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink-primary leading-[1.12]">
                  Corporate Fleet <br /><span className="italic text-accent font-normal">Maintenance.</span>
                </h1>
                <p className="font-sans text-ink-mid text-sm font-light leading-relaxed">
                  Consolidated device repair management for teams, corporate offices, and educational institutes operating in Delhi NCR. Keep your hardware assets optimized under guaranteed SLAs.
                </p>
              </div>

              {/* DYNAMIC CARD MATRICES */}
              <div className="space-y-6 pt-4">
                {valueProps.map((prop, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-bg-secondary/30 border border-half border-black/5 rounded-subtle">
                    <div className="mt-0.5">{prop.icon}</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-ink-primary uppercase tracking-wider">{prop.title}</h4>
                      <p className="text-xs text-ink-mid font-light leading-relaxed">{prop.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT REGISTRATION FORM CARD COLUMN */}
            <div className="lg:col-span-7 bg-bg-secondary/40 border border-half border-black/10 p-8 md:p-10 rounded-subtle">
              <div className="mb-8">
                <h3 className="font-serif text-2xl tracking-tight text-ink-primary mb-1">Onboarding Application</h3>
                <p className="text-xs text-ink-light font-light">Submit details to request bulk hardware servicing rates.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 border border-half border-accent text-accent text-xs rounded-subtle font-medium bg-accent/5">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Company / Institution Name</label>
                    <input 
                      type="text" 
                      name="companyName"
                      placeholder="e.g. Acme Corporation Pvt. Ltd."
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent text-ink-primary font-light"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Contact Person Name</label>
                    <input 
                      type="text" 
                      name="contactPerson"
                      placeholder="e.g. Jane Doe"
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent text-ink-primary font-light"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Job Designation / Title</label>
                    <input 
                      type="text" 
                      name="designation"
                      placeholder="e.g. IT Procurement Manager"
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent text-ink-primary font-light"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Corporate Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="e.g. procurement@acme.com"
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent text-ink-primary font-light"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="e.g. +91 98765 43210"
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent font-mono text-ink-primary font-light"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Estimated Device Fleet Size</label>
                    <input 
                      type="number" 
                      name="fleetSize"
                      placeholder="e.g. 150"
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent font-mono text-ink-primary font-light"
                      value={formData.fleetSize}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-ink-mid font-medium">Corporate Headquarters Address</label>
                    <textarea 
                      name="address"
                      rows={3}
                      placeholder="Specify your primary office street location and district details..."
                      className="border border-half border-black/10 rounded-subtle bg-bg-primary px-4 py-3 text-xs outline-none focus:border-accent resize-none text-ink-primary font-light leading-relaxed"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-ink-primary text-white text-xs uppercase tracking-wider py-4 rounded-subtle hover:bg-accent hover:text-white transition-colors cursor-pointer font-medium flex items-center justify-center border-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin mr-2"/> Processing Registry...
                      </>
                    ) : 'Submit Fleet Application'}
                  </button>
                </div>
              </form>

            </div>

          </div>
        )}

      </div>
      
    </div>
  );
}