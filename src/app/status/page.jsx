'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid';
import max from '../../image/Frame 2.png';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get('type'); // login | register | reset
  const status = searchParams.get('status'); // success | fail

  // Success messages
  const messages = {
    login: 'Sign In Successful Successful',
    register: 'Registration Successful',
    reset: 'Password Reset Successful',
  };

  // Fail messages
  const failMessages = {
    login: 'Login Failed',
    register: 'Registration Failed',
    reset: 'Password Reset Failed',
  };

  const message =
    status === 'success'
      ? messages[type] || 'Success!'
      : failMessages[type] || 'Something went wrong';

  // Redirect after 3 seconds
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        if (type === 'login') {
          router.push('/dashboard');
        } else if (type === 'reset' || type === 'register') {
          router.push('/login');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, type, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Logo or error icon */}
      {status === 'success' ? (
        <Image
          src={max}
          alt="ELAB Logo"
          className="w-[50%] max-w-[80px] h-auto mb-4"
        />
      ) : (
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
      )}

      {/* Message */}
      <p className="text-lg font-semibold">{message}</p>

      {/* Optional: small note */}
      {status === 'success' && (
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected shortly.
        </p>
      )}
    </div>
  );
};

export default SuccessPage;
