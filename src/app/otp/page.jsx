'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import max from '../../image/Group 75.png';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
    const otpRefs = useRef([]);

    // Handle email submission
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        console.log('OTP sent to:', email); // TODO: API call to send OTP
        setStep(2);
    };

    // Handle OTP change
    const handleOtpChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto move to next input
            if (value && index < 5) {
                otpRefs.current[index + 1].focus();
            }
        }
    };

    // Handle OTP submit
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        console.log('OTP entered:', otpCode); // TODO: API call to verify OTP
    };

    const handleResendOtp = () => {
        console.log('OTP resent to:', email); // TODO: API call to resend OTP
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
            <div className="flex flex-col items-center text-center max-w-md w-full">

                {/* Logo */}
                <div className="flex items-center justify-center mb-4">
                    <Image
                        src={max}
                        alt="ELAB Logo"
                        className="w-[100%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto"
                    />
                </div>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">We just sent you an OTP</h1>
                        <p className="text-gray-600 mb-6">
                            Enter the security code we sent to <span className="font-semibold">{email}</span>
                        </p>
                        <form onSubmit={handleEmailSubmit} className="w-full flex justify-center items-center flex-col gap-3">
                            <div>
                                {otp.map((digit, index) => (
                                    <input
                                        id="otp"
                                        type="number"
                                        name="otp"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full max-w-[70%] sm:max-w-[70%] md:max-w-[70%] lg:max-w-[70%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Send OTP
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">We just sent you an OTP</h1>
                        <p className="text-gray-600 mb-6">
                            Enter the security code we sent to<span className="font-semibold">{email}</span>
                        </p>
                        <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-3">
                            {/* OTP Inputs */}
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mt-4"
                            >
                                Verify OTP
                            </button>
                        </form>
                        <p className="mt-4 text-sm">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResendOtp}
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                Resend
                            </button>
                        </p>
                    </>
                )}

                {/* Footer */}
                <p className="text-gray-600 text-center text-xs mt-16">
                    © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
