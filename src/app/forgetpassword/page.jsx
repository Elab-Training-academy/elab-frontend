'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import max from '../../image/Group 75.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add forgot password API call here
    console.log('Reset link sent to:', email);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        
        <div className="flex items-center justify-center mb-4">
          <Image
            src={max}
            alt="ELAB Logo"
            className="w-[100%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-gray-600 mb-6">
          Lost access to your account? No problem, let's reset your password.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <label htmlFor="email" className="font-bold text-left">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-gray-600 text-center text-xs mt-6">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
