"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import aipoer from "../../src/image/aipower.png"; // AI-powered image
import adaptive from "../../src/image/adaptive.png"; // Adaptive testing image
import regional from "../../src/image/regional..png";
import analytics from "../../src/image/image/analytics.png";
import groups from "../../src/image/image/groups.png"; // Study groups image
import success from "../../src/image/image/success.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const WhyElab = () => {
  // Refs for animation targets
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const features = [
    {
      img: aipoer,
      title: "AI-Powered Learning",
      desc: "ELAB Assist provides personalized study recommendations and intelligent tutoring",
    },
    {
      img: adaptive,
      title: "Adaptive Testing",
      desc: "Smart practice sessions that adapt to your skill level and learning pace",
    },
    {
      img: regional,
      title: "Regional Content",
      desc: "Tailored content for Middle East (OMSB, DHA, Saudi Board) and Western exams",
    },
    {
      img: analytics,
      title: "Real-time Analytics",
      desc: "Track your progress with personalized study insights and intelligent reporting",
    },
    {
      img: groups,
      title: "Study Groups",
      desc: "Join collaborative learning communities and share knowledge",
    },
    {
      img: success,
      title: "Guaranteed Success",
      desc: "Comprehensive preparation with proven results and pass guarantees",
    },
  ];

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide all elements
      gsap.set([headerRef.current, ".feature-card"], {
        opacity: 0,
        y: 60,
        scale: 0.95
      });

      gsap.set(".feature-icon", {
        scale: 0,
        rotation: -180
      });

      // Header animation
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Feature cards staggered animation
      gsap.to(".feature-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: "start",
          ease: "power2.out"
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Feature icons animation (delayed)
      gsap.to(".feature-icon", {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: {
          amount: 0.6,
          from: "start",
        },
        ease: "back.out(2)",
        delay: 0.3,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Hover animations for cards
      const cards = document.querySelectorAll('.feature-card');
      cards.forEach((card, index) => {
        const icon = card.querySelector('.feature-icon');
        const title = card.querySelector('.feature-title');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out"
          });
          
          gsap.to(card.querySelector('.card-shadow'), {
            scale: 1.05,
            opacity: 0.15,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(icon, {
            scale: 1.1,
            rotation: 360,
            duration: 0.6,
            ease: "power2.out"
          });

          gsap.to(title, {
            color: "#2563eb",
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
          
          gsap.to(card.querySelector('.card-shadow'), {
            scale: 1,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(icon, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(title, {
            color: "#111827",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Floating animation for icons
      gsap.to(".floating-icon", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          amount: 1,
          from: "random"
        }
      });

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-gray-50 py-9 px-6 md:px-9 lg:px-28 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="parallax-bg absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-30 blur-lg"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-indigo-100 rounded-full opacity-25 blur-xl"></div>
      </div>

      {/* Heading */}
      <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-5 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Why Choose{" "}
          <span className="text-blue-600 relative">
            ELAB Academy
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform scale-x-0 animation-underline"></span>
          </span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Comprehensive preparation platform designed specifically for healthcare professionals
        </p>
      </div>

      {/* Features Grid */}
      <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
        {features.map((feature, i) => (
          <div
            key={i}
            className="feature-card relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer group overflow-hidden"
          >
            {/* Card shadow for hover effect */}
            <div className="card-shadow absolute inset-0 bg-gradient-to-br from-blue-500 to--gray-100rounded-2xl opacity-0 -z-10"></div>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Image Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 mb-3 feature-icon floating-icon">
                <Image 
                  src={feature.img} 
                  alt={feature.title} 
                  className="w-8 h-8 object-contain" 
                />
              </div>

              {/* Text */}
              <h3 className="feature-title text-lg font-semibold text-gray-900 mb-2 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>

              {/* Decorative dot */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animation-underline {
          animation: underlineGrow 2s ease-out 1s forwards;
        }
        
        @keyframes underlineGrow {
          to {
            transform: scale-x(1);
          }
        }
      `}</style>
    </section>
  );
};

export default WhyElab;