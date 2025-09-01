"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import adaptive from "../image/adaptive.png"; 
import mission from "../image/mission.png"; 

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AboutElab = () => {
  const [students, setStudents] = useState(0);
  const [passRate, setPassRate] = useState(0);
  
  // Refs for animation targets
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const descriptionRefs = useRef([]);
  const visionMissionRef = useRef(null);
  const statsRef = useRef(null);

  // Counter animation effect
  useEffect(() => {
    let studentTarget = 15000;
    let passTarget = 95;

    const studentInterval = setInterval(() => {
      setStudents((prev) => {
        if (prev < studentTarget) return prev + 250; 
        clearInterval(studentInterval);
        return studentTarget;
      });
    }, 50);

    const passInterval = setInterval(() => {
      setPassRate((prev) => {
        if (prev < passTarget) return prev + 1;
        clearInterval(passInterval);
        return passTarget;
      });
    }, 80);

    return () => {
      clearInterval(studentInterval);
      clearInterval(passInterval);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([headerRef.current, ...descriptionRefs.current, visionMissionRef.current, statsRef.current], {
        opacity: 0,
        y: 50
      });

      // Header animation
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Description paragraphs staggered animation
      gsap.to(descriptionRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRefs.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Vision/Mission cards animation
      gsap.to(".vision-mission-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: visionMissionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Stats section animation
      gsap.to(".stat-item", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Hover animations for cards
      const cards = document.querySelectorAll('.vision-mission-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(card.querySelector('.card-icon'), {
            rotation: 360,
            duration: 0.6,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Floating animation for icons
      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToDescriptionRefs = (el) => {
    if (el && !descriptionRefs.current.includes(el)) {
      descriptionRefs.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="text-black px-6 md:px-20 lg:px-16 py-5 bg-white overflow-hidden">
      {/* Header Section */}
      <div ref={headerRef} className="flex flex-col items-center w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-1">
          About <span className="text-blue-500 relative">
            ELAB Academy
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
          </span>
        </h2>
        <p className="text-gray-500 text-lg mb-1">
          Empowering Healthcare Professionals to Succeed — Wherever They Are.
        </p>
      </div>

      {/* Description Paragraphs */}
      <div className="flex flex-col items-center w-full mx-auto">
        <p ref={addToDescriptionRefs} className="text-gray-400 mb-3 opacity-0">
          ELAB Academy is the academic division of ELAB Solutions International
          LLC, a globally trusted partner for healthcare licensure and
          professional development. Founded with a bold mission to simplify and
          strengthen the journey of international healthcare professionals. ELAB
          Academy provides high-impact exam preparation, licensure support, and
          career advancement training for nurses, midwives, doctors,
          pharmacists, and allied health professionals.
        </p>
        <p ref={addToDescriptionRefs} className="text-gray-400 mb-3 opacity-0">
          We specialize in preparing candidates for critical licensure and
          qualifying exams such as the Saudi SCFHS licensing exam, Prometric,
          NCLEX- RN/PN, CGFNS, DHA, HAAD, MOHAP, and English language
          proficiency exams like OET and IELTS. But we are more than just a test
          prep center.
        </p>
        <p ref={addToDescriptionRefs} className="text-gray-400 opacity-0">
          At ELAB Academy, we combine rigorous academic content, smart
          technology, and hands-on licensing guidance to deliver a unique
          end-to-end solution—from learning to licensure. Whether you're
          studying from Nigeria, the Philippines, Kenya, India, Saudi Arabia, or
          the United States, our programs are built to meet you where you are— 
          and take you where you want to go.
        </p>
      </div>

      {/* Vision/Mission Cards */}
      <div ref={visionMissionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        <div className="vision-mission-card bg-white rounded-2xl shadow-lg p-8 text-center opacity-0 transform hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center mb-4 card-icon floating-icon">
            <Image
              src={adaptive}
              alt="Vision"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Our Vision
          </h3>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted global hub for healthcare exam readiness and
            licensing success.
          </p>
        </div>

        <div className="vision-mission-card bg-white rounded-2xl shadow-lg p-8 text-center opacity-0 transform hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center mb-4 card-icon floating-icon">
            <Image
              src={mission}
              alt="Mission"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Our Mission
          </h3>
          <p className="text-gray-600 leading-relaxed">
            To equip every international healthcare professional with the tools,
            knowledge, and support to pass their licensing exams confidently and
            practice without borders.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-16 max-w-5xl mx-auto">
        <div className="stat-item opacity-0 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {students.toLocaleString()}+
          </h3>
          <p className="text-gray-400">Active Students</p>
          <div className="mt-2 w-full bg-blue-100 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transform transition-all duration-1000 ease-out" 
                 style={{width: students > 0 ? '90%' : '0%'}}></div>
          </div>
        </div>

        <div className="stat-item opacity-0 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {passRate}%
          </h3>
          <p className="text-gray-400">Pass Rate</p>
          <div className="mt-2 w-full bg-blue-100 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transform transition-all duration-1000 ease-out" 
                 style={{width: passRate > 0 ? `${passRate}%` : '0%'}}></div>
          </div>
        </div>

        <div className="stat-item opacity-0 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            50,000+
          </h3>
          <p className="text-gray-400">Practice Questions</p>
          <div className="mt-2 w-full bg-blue-100 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full w-full transform transition-all duration-1000 ease-out delay-500"></div>
          </div>
        </div>

        <div className="stat-item opacity-0 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            24/7
          </h3>
          <p className="text-gray-400">Support Available</p>
          <div className="mt-2 w-full bg-blue-100 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full w-full transform transition-all duration-1000 ease-out delay-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutElab;