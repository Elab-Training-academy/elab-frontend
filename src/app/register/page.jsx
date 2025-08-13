'use client';
import React, { useState } from 'react';
import BlurText from './BlurText';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import max from '../../image/Group 75.png';
import google from '../../image/download (1).png';
import facebook from '../../image/download.png';
import { useAuthStore } from "../../store/authStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [create, setCreate] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const url = useAuthStore((state) => state.url);

  const handleAnimationComplete = () => {
    console.log('Welcome completed!');
  };

const handleCreateAccount = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  setCreate(true);

  try {
    const res = await fetch(`${url}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ full_name: name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.detail || 'Something went wrong');
    }

    toast.success('Account created successfully!');
    setTimeout(() => {
      // Redirect to success page with parameters
      router.push('/status?type=register&status=success');
    }, 2000);

  } catch (error) {
    toast.error(error.message);
  } finally {
    setCreate(false);
  }
};


  return (
    <>
      <form
        onSubmit={handleCreateAccount}
        className="space-y-4 max-w-md mx-auto p-6 bg-white "
      >
        <div className="flex items-center justify-center">
          <Image
            src={max}
            alt="ELAB Logo"
            className="max-w-[80px] h-auto mb-4"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <BlurText
            text="Join ELAB Academy"
            className="text-[25px] sm:text-[30px] font-bold"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Create your account to access world-class medical education
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-bold">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-bold">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="font-bold">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
          disabled={create}
        >
          {create ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle  className="opacity-25"cx="12" cy="12" r="10" stroke="currentColor"   strokeWidth="4" ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">Or sign up with</p>
          <div className="flex items-center justify-around gap-10 mt-3">
            <button
              type="button"
              className="flex w-[40%] items-center gap-2 px-4 py-2 border-2 border-solid border-[#2563EB] rounded-md hover:bg-gray-100 transition"
            >
              <Image src={google} alt="Google" className="w-5 h-5" />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              className="flex  w-[40%] items-center gap-2 px-4 py-2 border-2 border-solid border-[#2563EB] rounded-md hover:bg-gray-100 transition"
            >
              <Image src={facebook} alt="Facebook" className="w-5 h-5" />
              <span>Google</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>

        <p className="text-gray-600 text-center text-xs">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </form>

      <ToastContainer position="top-center" />
    </>
  );
};

export default Page;
