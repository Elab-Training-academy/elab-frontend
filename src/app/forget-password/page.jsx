'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import max from '../../image/Group 75.png';
import { useAuthStore } from '@/store/authStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const url = useAuthStore((state) => state.url);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${url}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Password link sent to your email.');

        // Navigate to OTP page after 2 seconds
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(email)}`);
        }, 2000);

        setEmail('');
      } else {
        toast.error(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error(error);
      toast.error('No Internet Connection!');
    } finally {
      setLoading(false);
    }
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
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="text-gray-600 text-center text-xs mt-6">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ForgotPasswordPage;
