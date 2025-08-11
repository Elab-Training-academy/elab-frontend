'use client';
import React, { useState } from 'react';
import BlurText from './BlurText';
import Image from 'next/image';
import max from '../../image/Group 75.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import {useAuthStore} from "../../store/authStore"


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, setSignin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

   // zustand fetching ///
  const url = useAuthStore((state) => state.url)
  const token = useAuthStore((state)=> state.token)
  console.log(url);
  console.log(token);
  

  const handleAnimationComplete = () => {
    console.log('Welcome Back animation completed!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSignin(true);

    try {
      const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
         },
        body: JSON.stringify({ email, password }),
      });

      
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        toast.success('Login successful!');
        
        localStorage.setItem("token", data.access_token)
      } else {
        toast.error(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('No Internet Connection!');
    } finally {
      setSignin(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center">
          <Image   src={max}    alt="ELAB Logo" className="w-[50%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto mb-4" />
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <BlurText
            text="Welcome Back"
            className="text-[32px] sm:text-[50px] font-bold text-center"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
          />
          <p className="text-[18px] font-normal text-center text-gray-700">
            Ready to pick up where you left off?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">Email Address</label>
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
          </div>

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="font-bold">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}    name="password"    placeholder="Enter your password"    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"    required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-3 top-[45px] cursor-pointer text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>

          <p className="text-sm text-blue-600 cursor-pointer hover:underline">
            Forgot Password? Get a new one
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={signin}
          >
            {signin ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm">
          Not registered?{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Create an account
          </span>
        </p>

        <p className="text-gray-600 text-center text-xs">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </main>
  );
};

export default LoginPage;

