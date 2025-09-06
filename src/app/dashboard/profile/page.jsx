"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, Mail, Upload } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const profile = useAuthStore((state) => state.profile);
  const loadingProfile = useAuthStore((state) => state.loadingProfile);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync store profile into form state
  useEffect(() => {
    if (profile) {
      console.log("Profile data from store:", profile); // Debug log
      setFormData({
        firstName: profile.full_name || profile.firstName || profile.first_name || "",
        lastName: profile.last_name || profile.lastName || "",
        email: profile.email || "",
      });
      
      // Set profile image from various possible fields
      const existingImage = profile.profile_picture || profile.profilePicture || profile.avatar;
      if (existingImage) {
        setProfileImage(existingImage);
      }
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("❌ File size too large. Please choose a file under 5MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("❌ Please select a valid image file.");
        return;
      }

      // Store the file for upload
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        console.log("Image preview set:", e.target.result.substring(0, 50) + "...");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.full_name || profile.firstName || profile.first_name || "",
        lastName: profile.last_name || profile.lastName || "",
        email: profile.email || "",
      });
      
      const existingImage = profile.profile_picture || profile.profilePicture || profile.avatar;
      setProfileImage(existingImage || "");
      setImageFile(null);
    }
  };

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      formData.append('image', file); // Sometimes backend expects 'image'
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Image upload result:", result);
      
      // Return the image URL from the server response
      return result.imageUrl || result.url || result.profile_picture || result.data?.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      
      // Fallback: use base64 if server upload fails
      console.log("Falling back to base64 storage");
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let imageUrl = profileImage;

      // If there's a new image file, upload it first
      if (imageFile) {
        console.log("Uploading new image...");
        imageUrl = await uploadImageToServer(imageFile);
        console.log("New image URL:", imageUrl);
      }

      const updatePayload = {
        full_name: formData.firstName,
        firstName: formData.firstName,
        first_name: formData.firstName,
        last_name: formData.lastName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // Add image URL to payload if we have one
      if (imageUrl && imageUrl !== (profile?.profile_picture || profile?.profilePicture || profile?.avatar)) {
        updatePayload.profile_picture = imageUrl;
        updatePayload.profilePicture = imageUrl; // Sometimes backend expects this
        updatePayload.avatar = imageUrl; // Sometimes backend expects this
      }

      console.log("Sending update payload:", updatePayload);

      const success = await updateProfile(updatePayload);
      console.log("Update result:", success);

      if (success === true || success) {
        toast.success("✅ Profile updated successfully!");
        
        // Clear the file after successful update
        setImageFile(null);
        
        // Fetch fresh profile data to ensure UI is in sync
        await fetchProfile();
        
        // Small delay to ensure state updates and trigger navbar refresh
        setTimeout(() => {
          window.dispatchEvent(new Event('profileUpdated'));
        }, 100);
      } else {
        toast.error("❌ Failed to update profile. Please check console for details.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`❌ Error updating profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    return formData.firstName.trim() && formData.email.trim();
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 text-lg font-medium">
          Loading profile...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
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
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Profile
          </h1>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8">
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Personal info
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Update your photo and personal details here.
            </p>

            {/* Name Fields */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Name
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="First name"
                  required
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your photo
                  </label>
                  <p className="text-sm text-gray-600">
                    This will be displayed on your profile.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                  {/* Current Profile Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-200 flex-shrink-0">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Profile image failed to load:", profileImage);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{display: 'none'}}>
                      Error
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1 w-full">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 sm:p-8 text-center hover:border-blue-300 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <div className="space-y-1">
                        <button
                          type="button"
                          className="text-blue-600 font-medium hover:text-blue-700"
                          onClick={() =>
                            document.getElementById("photo-upload").click()
                          }
                        >
                          Click to upload
                        </button>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        PNG, JPG or GIF (max. 5MB)
                      </p>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {imageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ New image selected: {imageFile.name}
                      </p>
                    )}
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
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isFormValid()}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;