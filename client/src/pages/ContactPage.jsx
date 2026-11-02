import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Check, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactPage = () => {
  const { showToast } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bespoke Jewellery Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Incomplete Form', 'Please provide required details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId);
        setSubmitted(true);
        showToast('Inquiry Dispatched', `Reference #${data.ticketId}: Our senior concierge will connect with you.`, 'gold');
      } else {
        showToast('Submission Failed', data.message || 'Could not submit inquiry.', 'error');
      }
    } catch {
      showToast('Network Error', 'Could not connect to Tiwari Jewellers concierge server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
            Dedicated Concierge Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy mt-2 mb-3">
            Contact Tiwari Jewellers
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-sans">
            Our master gemologists and personal jewellery styling concierges are available 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: BOUTIQUE LOCATIONS & CONTACT (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-lg text-burgundy pb-3 border-b border-ivory-200">
                Flagship Boutiques
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">Mumbai Flagship Showroom</h4>
                    <p className="text-charcoal-500 mt-0.5">Tiwari Heritage Mansion, 12 Zaveri Bazaar Road, Kalbadevi, Mumbai 400002</p>
                    <p className="text-[11px] text-charcoal-400 mt-1">Valet Parking & Private Vault Viewing Available</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-ivory-200">
                  <MapPin className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">New Delhi Heritage Salon</h4>
                    <p className="text-charcoal-500 mt-0.5">E-14 South Extension Part 1, Ring Road, New Delhi 110049</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-4 text-xs font-sans">
              <h3 className="font-serif font-bold text-lg text-burgundy pb-2 border-b border-ivory-200">
                Direct Concierge Contacts
              </h3>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-burgundy shrink-0" />
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Client Support Hotline</span>
                  <span className="font-bold text-charcoal text-sm">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-700 shrink-0" />
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Direct Email</span>
                  <span className="font-bold text-charcoal text-sm">concierge@tiwarijewellers.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-burgundy shrink-0" />
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Hours of Hospitality</span>
                  <span className="text-charcoal-600">Mon – Sun: 10:30 AM to 8:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM (7 COLS) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-ivory-300 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-burgundy mb-2">
                Request a Private Appointment or Inquiry
              </h3>
              <p className="text-xs text-charcoal-500 font-sans mb-6">
                Fill in your details below and our jewellery specialist will connect with you via WhatsApp or phone.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-900 space-y-3">
                  <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-lg">Thank You for Reaching Out</h4>
                  {ticketId && (
                    <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-mono font-bold text-emerald-800">
                      Inquiry Ticket: {ticketId}
                    </div>
                  )}
                  <p className="text-xs font-sans max-w-sm mx-auto text-emerald-800">
                    Your consultation request has been dispatched to our senior master gemologist. We look forward to welcoming you.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setName(''); setEmail(''); setPhone(''); setMessage(''); }}
                    className="mt-3 px-5 py-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patron@example.com"
                        className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                        Subject of Inquiry
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy bg-white"
                      >
                        <option value="Bespoke Jewellery Consultation">Bespoke Bridal Jewellery Consultation</option>
                        <option value="Solitaire Diamond Sizing">Solitaire Diamond & Ring Sizing Inquiry</option>
                        <option value="Order Tracking & Vault Delivery">Order Status & Insured Dispatch</option>
                        <option value="Showroom Private Appointment">Book Private Boutique Viewing</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                        Message / Specific Requirements *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please share details such as ring size, metal preference (22K Gold, 18K Rose Gold, 925 Silver) or occasion date..."
                        className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-burgundy hover:bg-burgundy-600 disabled:opacity-70 text-gold-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Dispatching Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
