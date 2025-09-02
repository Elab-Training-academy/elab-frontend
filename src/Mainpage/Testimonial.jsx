"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import star from "../image/star.png";
import herodocto from "../image/herodoctor.png";

const Testimonials = () => {
  const reviews = [
    {
      name: "Maria Santos",
      role: "DHA Licensed Nurse",
      feedback:
        "Thanks to ELAB Academy, I passed my DHA exam in just 2 months of preparation. The mock exams and detailed analytics helped me track my progress effectively.",
    },
    {
      name: "Dr. Ahmed Hassan",
      role: "OMSB Resident",
      feedback:
        "The Middle East exam preparation was exactly what I needed. The regional content and practice questions were spot-on. Highly recommended!",
    },
    {
      name: "Sarah Johnson",
      role: "NCLEX-RN Graduate",
      feedback:
        "ELAB Academy transformed my NCLEX preparation. The AI-powered study plans helped me focus on my weak areas, and I passed on my first attempt!",
    },
    {
      name: "James Miller",
      role: "OET Candidate",
      feedback:
        "The English preparation course boosted my confidence. I scored higher than I expected on my OET exam.",
    },
    {
      name: "Fatima Ali",
      role: "MOH Licensed Nurse",
      feedback:
        "The practice questions and simulated exams were very close to the real test. I cleared MOH smoothly.",
    },
    {
      name: "David Kim",
      role: "IELTS Candidate",
      feedback:
        "The healthcare-specific English training was a game changer. I finally achieved my required IELTS band score.",
    },
  ];

  return (
    <section className="bg-[#F9FAFB] py-12 px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Top Section */}
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 mb-10">
        {/* Left Content */}
        <div className="text-center lg:text-left max-w-xl lg:max-w-2xl space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-gray-900">
            Join Thousands of{" "}
            <span className="text-blue-600">Successful Clinicians</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            At ELAB Academy, we believe that access, accuracy, and accountability are
            the cornerstones of effective preparation. That’s why we stand with you
            at every step—from registration to exam day, and even to your first day
            on the job abroad.
          </p>

          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition">
            Enroll Now →
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center lg:justify-end w-full lg:w-auto">
          <div className="relative w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]">
            <Image
              src={herodocto}
              alt="Clinician"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Swiper Testimonials */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition h-full">
              {/* Star Rating */}
              <div className="flex mb-3">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Image
                      key={index}
                      src={star}
                      alt="star"
                      className="w-5 h-5 mr-1"
                    />
                  ))}
              </div>

              {/* Feedback */}
              <p className="text-gray-700 italic mb-4 leading-relaxed">
                "{review.feedback}"
              </p>

              {/* Name & Role */}
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              <p className="text-gray-500 text-sm">{review.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
