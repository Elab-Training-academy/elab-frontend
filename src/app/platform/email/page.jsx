// app/page.jsx
"use client";

import { useState } from "react";
import { Save, Mail, Server, User, Lock, Shield } from "lucide-react";

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    smtpHost: "smtp.gmail.com",
    port: "587",
    smtpUsername: "Advance Medical Education Platform",
    smtpPassword: "Advance Medical Education Platform",
    senderName: "noreply2elab.com",
    senderEmail: "ELAB Academy"
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Email settings saved:", settings);
    // Add your save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Email Settings Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Email</h1>
            <p className="text-gray-600 mt-1">Platform Configuration</p>
          </div>

          {/* Email Settings Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Mail size={20} className="mr-2" /> Email Settings
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              {/* SMTP Host and Port */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Server size={16} className="mr-2" /> SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={settings.smtpHost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={settings.port}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="587"
                    required
                  />
                </div>
              </div>

              {/* SMTP Username and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User size={16} className="mr-2" /> SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your SMTP username"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Lock size={16} className="mr-2" /> SMTP Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="smtpPassword"
                      value={settings.smtpPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="Your SMTP password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Shield size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sender Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={settings.senderName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="noreply@elab.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={settings.senderEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ELAB Academy"
                    required
                  />
                </div>
              </div>

              {/* Additional Settings (Optional) */}
              <div className="mb-6 md:mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Settings (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Encryption</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Authentication</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Login</option>
                      <option>Plain</option>
                      <option>CRAM-MD5</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} /> Save Email Settings
                </button>
              </div>
            </form>
          </div>

          {/* Test Connection Button */}
          <div className="mt-6 bg-white shadow-md rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Connection</h3>
            <p className="text-gray-600 mb-4">Test your email configuration before saving</p>
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Email Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}