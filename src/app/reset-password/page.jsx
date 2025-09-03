// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import max from '../../image/Group 75.png';
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
// import { useAuthStore } from '@/store/authStore';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ResetPasswordPage = () => {
//   const searchParams = useSearchParams();
//   const initialEmail = searchParams.get('email') || '';
//   const router = useRouter();

//   const [email, setEmail] = useState(initialEmail);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const url = useAuthStore((state) => state.url);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    

//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match!');
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${url}/auth/reset-password`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, new_password: password }),
//       });

//       if (res.ok) {
//         toast.success('Password reset successful!');
//         setTimeout(() => {
//           router.push('/status?type=reset&status=success');
//         }, 1500);
//       } else {
//         const data = await res.json();
//         toast.error(data.detail || 'Failed to reset password');
//       }
//     } catch (err) {
//       console.error('Error resetting password:', err);
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex justify-center items-center px-4">
//       <div className="w-full max-w-md p-6 text-center">
//          <a href='/' className="flex justify-center mb-4">
//           <Image src={max} alt="ELAB Logo" className="w-[50px] h-auto" />
//         </a>

//         <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reset Password</h1>
//         <p className="mb-6 text-gray-600 text-sm sm:text-base">
//           Secure your account by resetting your password.
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
//           <div>
//             <label htmlFor="email" className="font-bold text-sm sm:text-base">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
//               required
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="password" className="font-bold text-sm sm:text-base">
//               New Password
//             </label>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Enter new password"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
//               required
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//             />
//             <span
//               className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
//             </span>
//           </div>

//           <div className="relative">
//             <label htmlFor="confirmPassword" className="font-bold text-sm sm:text-base">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Confirm new password"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
//               required
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               value={confirmPassword}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-md transition text-white flex justify-center items-center ${
//               loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </div>
//             ) : (
//               'Continue'
//             )}
//           </button>
//         </form>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </main>
//   );
// };

// export default ResetPasswordPage;




'use client';
import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import max from '../../image/Group 75.png';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const router = useRouter();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = useAuthStore((state) => state.url);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${url}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: password }),
      });

      if (res.ok) {
        toast.success('Password reset successful!');
        setTimeout(() => {
          router.push('/status?type=reset&status=success');
        }, 1500);
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md p-6 text-center">
        <a href="/" className="flex justify-center mb-4">
          <Image src={max} alt="ELAB Logo" className="w-[50px] h-auto" />
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reset Password</h1>
        <p className="mb-6 text-gray-600 text-sm sm:text-base">
          Secure your account by resetting your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="email" className="font-bold text-sm sm:text-base">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="font-bold text-sm sm:text-base">
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
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
            <label
              htmlFor="confirmPassword"
              className="font-bold text-sm sm:text-base"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white flex justify-center items-center ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
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
                Processing...
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </main>
  );
};

// ✅ Wrap in Suspense to fix the build error
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
