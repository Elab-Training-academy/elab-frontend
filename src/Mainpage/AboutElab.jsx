"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import adaptive from "../image/adaptive.png";
import mission from "../image/mission.png";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const AboutElab = () => {
  const [students, setStudents] = useState(0);
  const [passRate, setPassRate] = useState(0);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const descriptionRefs = useRef([]);
  const visionMissionRef = useRef(null);
  const statsRef = useRef(null);

  // Animate numbers when stats section enters viewport
  useEffect(() => {
    if (!statsRef.current) return;

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to({}, {
          duration: 3,
          onUpdate: function () {
            const progress = this.progress();
            setStudents(Math.floor(progress * 15000));
            setPassRate(Math.floor(progress * 95));
          }
        });
      }
    });
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%"
        }
      });

      // Description animation
      gsap.from(descriptionRefs.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRefs.current[0],
          start: "top 80%"
        }
      });

      // Vision/Mission cards
      gsap.from(".vision-mission-card", {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: visionMissionRef.current,
          start: "top 80%"
        }
      });

      // Stats items
      gsap.from(".stat-item", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%"
        }
      });

      // Floating icons
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
    <section
    id="about"
      ref={sectionRef}
      className="text-black px-6 md:px-20 lg:px-16 py-5 bg-white overflow-hidden"
    >
      {/* Header */}
      <div ref={headerRef} className="flex flex-col items-center w-full mx-auto text-center mt-5">
        <h2 className="text-2xl md:text-3xl font-semibold">
          About{" "}
          <span className="text-blue-500 relative">
            ELAB Academy
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-500"></span>
          </span>
        </h2>
        <p className="text-black text-[1rem] my-4">
          Empowering Healthcare Professionals to Succeed — Wherever They Are.
        </p>
      </div>

      {/* Description */}
      <div className="flex flex-col items-center w-full gap-3 text-center">
        <p ref={addToDescriptionRefs} className="text-gray-500">
          ELAB Academy is the academic division of ELAB Solutions International
          LLC, a globally trusted partner for healthcare licensure and
          professional development. Founded with a bold mission to simplify and
          strengthen the journey of international healthcare professionals.
        </p>
        <p ref={addToDescriptionRefs} className="text-gray-500">
          We specialize in preparing candidates for licensure and qualifying
          exams such as SCFHS, Prometric, NCLEX-RN/PN, DHA, HAAD, MOHAP, and
          English language exams like OET and IELTS.
        </p>
        <p ref={addToDescriptionRefs} className="text-gray-500">At ELAB Academy, we combine rigorous academic content, smart
          technology, and hands-on guidance to deliver end-to-end solutions —
          from learning to licensure.
        </p>
      </div>

      {/* Vision & Mission */}
      <div
        ref={visionMissionRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12"
      >
        <div className="vision-mission-card bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4 card-icon floating-icon">
            <Image src={adaptive} alt="Vision" className="w-20 h-20 object-contain" />
          </div>
          <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Our Vision
          </h3>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted global hub for healthcare exam readiness and
            licensing success.
          </p>
        </div>

        <div className="vision-mission-card bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4 card-icon floating-icon">
            <Image src={mission} alt="Mission" className="w-20 h-20 object-contain" />
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

      {/* Stats */}
      <div
        ref={statsRef}
        className="grid grid-col md:grid-cols-4 gap-8 text-center mt-16 max-w-5xl mx-auto"
      >
        <div className="stat-item transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {students.toLocaleString()}+
          </h3>
          <p className="text-gray-400">Active Students</p>
        </div>

        <div className="stat-item transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {passRate}%
          </h3>
          <p className="text-gray-400">Pass Rate</p>
        </div>

        <div className="stat-item transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            50,000+
          </h3>
          <p className="text-gray-400">Practice Questions</p>
        </div>

        <div className="stat-item transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            24/7
          </h3>
          <p className="text-gray-400">Support Available</p>
        </div>
      </div>
    </section>
  );
};

export default AboutElab;
