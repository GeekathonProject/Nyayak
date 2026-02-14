import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from './components/Navbar';

const ContactPage = () => {
  const [role, setRole] = useState('Citizen');

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#FFF9F1] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-[#E67E22] tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-4xl font-extrabold text-[#1A1A1A] sm:text-5xl">
            How can we assist you today?
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Whether you are seeking legal aid, offering counsel, or representing law enforcement, we are here to bridge the gap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Information Cards */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-100 p-3 rounded-lg text-[#E67E22]">
                    <Mail size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Email Us</p>
                    <p className="text-gray-600">support@nyayasahayak.gov.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-100 p-3 rounded-lg text-[#E67E22]">
                    <Phone size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Helpline</p>
                    <p className="text-gray-600">+91 1800-NYAYA-HELP</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-100 p-3 rounded-lg text-[#E67E22]">
                    <MapPin size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Headquarters</p>
                    <p className="text-gray-600">Legal Block, Digital India Bhavan, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-[#1A1A1A] text-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-xl font-bold mb-2">Emergency Services?</h4>
              <p className="text-gray-400">Our automated FIR tracking and emergency drafting tools are available 24/7 via the platform.</p>
              <button className="mt-6 w-full bg-[#E67E22] py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                Launch Platform →
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100">
            <form className="grid grid-cols-1 gap-y-6">
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">I am a:</label>
                <div className="flex p-1 bg-gray-100 rounded-xl space-x-1">
                  {['Citizen', 'Lawyer', 'Police'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                        role === item ? 'bg-white text-[#E67E22] shadow' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
                  placeholder={role === 'Police' ? "Station ID / Case Inquiry" : "How can we help?"} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows="4" className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Describe your query in detail..."></textarea>
              </div>

              <button type="submit" className="w-full flex justify-center items-center space-x-2 py-4 px-6 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;