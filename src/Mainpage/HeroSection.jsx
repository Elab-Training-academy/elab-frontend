"use client";

import React from "react";
import Image from "next/image";
import doctopn from "../image/doctor.png";

const HeroSection = () => {
  return (
    <section className="flex justify-between flex-col-reverse lg:flex-row items-center px-6 md:px-12 lg:px-16 py-7 bg-white max-h-[90vh]">
      {/* Left Content */}
      <div className="space-y-6 text-center lg:text-left max-w-2xl px-5">
        <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-5xl font-bold text-black leading-snug">
          Master Your Medical Licensing Exams with Confidence
        </h1>
        <p className="text-gray-700 text-base sm:text-[16px] md:text-lg leading-relaxed">
          Comprehensive preparation for NCLEX-RN, OMSB, DHA, Saudi Board, and
          more. Join the thousands who've succeeded with our proven
          methodology.
        </p>

        <div>
          <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold">
        Get Started
        </a>
        </div>

      </div>

      {/* Right Content */}
      <div className="mb-10 lg:mb-0 flex justify-center lg:justify-end w-fit lg:w-auto">
        <div className="relative sm:pt-5">
          <Image
            src={doctopn}
            alt="Clinician"
            className="w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
