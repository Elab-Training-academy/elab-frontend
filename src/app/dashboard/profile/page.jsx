"use client";
import React, { useState } from 'react';
import { Search, Bell, Mail, Upload } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: 'Ahmad',
    lastName: 'Ibrahim',
    email: 'ahmadalaro@gmail.com'
  });
  
  const [profileImage, setProfileImage] = useState('/api/placeholder/80/80');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8">
          {/* Personal Info Section */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Personal info</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Update your photo and personal details here.
            </p>

            {/* Name Fields */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Name</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="First name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your photo</label>
                  <p className="text-sm text-gray-600">This will be displayed on your profile.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                  {/* Current Profile Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-200">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Upload Area */}
                  <div className="flex-1 w-full">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 sm:p-8 text-center hover:border-blue-300 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <div className="space-y-1">
                        <button
                          type="button"
                          className="text-blue-600 font-medium hover:text-blue-700"
                          onClick={() => document.getElementById('photo-upload').click()}
                        >
                          Click to upload
                        </button>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        PNG, JPG or GIF (max. 800×400px)
                      </p>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 sm:px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
