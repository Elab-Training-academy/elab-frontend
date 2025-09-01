// app/page.jsx
"use client";
import { useState } from "react";
import { Save, Database, Server, Cpu, Clock, Hash } from "lucide-react";

export default function DatabaseSettings() {
  const [settings, setSettings] = useState({
    databaseHost: "",
    port: "3306",
    databaseName: "Advance Medical Education Platform",
    maxConnections: "100",
    connectionTimeout: "3000"
  });

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
    console.log("Database settings saved:", settings);
    // Add your save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Platform Configuration Sidebar - Hidden on mobile */}
        

        {/* Database Settings Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Database</h1>
            <p className="text-gray-600 mt-1">Platform Configuration</p>
          </div>

          {/* Database Settings Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Database size={20} className="mr-2" /> Database Settings
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              {/* Database Host and Port */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Server size={16} className="mr-2" /> Database Host
                  </label>
                  <select
                    name="databaseHost"
                    value={settings.databaseHost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="localhost">Localhost</option>
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="sqlserver">SQL Server</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Hash size={16} className="mr-2" /> Port
                  </label>
                  <input
                    type="text"
                    name="port"
                    value={settings.port}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3306"
                    required
                  />
                </div>
              </div>

              {/* Database Name and Max Connections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    name="databaseName"
                    value={settings.databaseName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter database name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Cpu size={16} className="mr-2" /> Max. Connection
                  </label>
                  <input
                    type="number"
                    name="maxConnections"
                    value={settings.maxConnections}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Connection Timeout */}
              <div className="mb-6 md:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" /> Connection Timeout (ms)
                </label>
                <input
                  type="number"
                  name="connectionTimeout"
                  value={settings.connectionTimeout}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000"
                  min="1000"
                  step="100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Timeout duration in milliseconds for database connections
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} /> Save Database Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}