// app/page.jsx
"use client";

import { useState } from "react";
import { Save, Globe, Mail, Link, Lock, Users } from "lucide-react";

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    platformName: "ELa e Academy",
    platformUrl: "https://elabacademy.com",
    platformDescription: "Advance Medical Education Platform",
    supportEmail: "support@elab.com",
    defaultLanguage: "English",
    defaultRegion: "Middle East",
    openRegistration: true,
    maintenanceMode: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Settings saved:", settings);
    // Add your save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">General</h1>
          <p className="text-gray-600 mt-1">Platform Configuration</p>
        </div>

        {/* General Settings Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            {/* Platform Name and URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  name="platformName"
                  value={settings.platformName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter platform name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Link size={16} className="mr-2" /> Platform URL
                </label>
                <input
                  type="url"
                  name="platformUrl"
                  value={settings.platformUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Platform Description and Support Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Description
                </label>
                <textarea
                  name="platformDescription"
                  value={settings.platformDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter platform description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail size={16} className="mr-2" /> Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="support@example.com"
                />
              </div>
            </div>

            {/* Default Language and Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Globe size={16} className="mr-2" /> Default Language
                </label>
                <select
                  name="defaultLanguage"
                  value={settings.defaultLanguage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Region
                </label>
                <select
                  name="defaultRegion"
                  value={settings.defaultRegion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Middle East">Middle East</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="South America">South America</option>
                </select>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4 mb-6 md:mb-8">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users size={18} className="text-gray-600 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Open Registration
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow new users to register without restriction
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="openRegistration"
                    checked={settings.openRegistration}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Lock size={18} className="text-gray-600 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-xs text-gray-500">
                      Temporarily disable access to this platform
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <Save size={18} /> Save General Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}