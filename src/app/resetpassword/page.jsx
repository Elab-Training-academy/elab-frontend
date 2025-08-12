'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import max from '../../image/Group 75.png';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('New password:', password);
    // TODO: Send password to backend API for reset
  };

  return (
    <main className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md p-6 text-center">
        
        <div className="flex justify-center mb-4">
          <Image
            src={max}
            alt="ELAB Logo"
            className="w-[50px] h-auto sm:w-[50px]"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reset Password</h1>
        <p className="mb-6 text-gray-600 text-sm sm:text-base">
          Secure your account by resetting your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          <div className="relative">
            <label htmlFor="password" className="font-bold text-sm sm:text-base">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="font-bold text-sm sm:text-base">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue 
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
