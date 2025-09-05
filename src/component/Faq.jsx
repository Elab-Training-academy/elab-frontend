'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Faq = () => {
  const [activeItems, setActiveItems] = useState({});

  const toggleItem = (itemId) => {
    setActiveItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const faqData = [
    {
      id: 'quiz-preparation',
      questions: [
        {
          id: 'study-schedule',
          question: 'Why NCLEX?',
          answer:
            'The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is a standardized exam that nursing graduates must pass to become licensed registered nurses in the U.S. and Canada. It tests your knowledge, critical thinking, and decision-making skills in real-life nursing scenarios.',
        },
      ],
    },
    {
      id: 'aimla-mastery',
      questions: [
        {
          id: 'exam-topics',
          question: 'DHA License Preparation',
          answer:
            'The DHA exam evaluates healthcare professionals on medical knowledge, clinical skills, and familiarity with UAE healthcare regulations. Preparation should include reviewing medical guidelines, practicing past questions, and focusing on patient safety standards.',
        },
      ],
    },
    {
      id: 'exam-experiences',
      title: 'Exam-Based Experiences',
      questions: [
        {
          id: 'night-before',
          question: 'OMSB Exam Mastery',
          answer:
            'For the Oman Medical Specialty Board (OMSB) exam, ensure you get 7–8 hours of sleep, lightly review high-yield topics, organize your documents and materials in advance, and avoid cramming new information to stay calm and focused on exam day.',
        },

        {
          id: 'time-management',
          question: 'Saudi Board Excellence',
          answer:
            'For the Saudi Board exam, start by quickly scanning all questions to get an overview. Answer the easy ones first, mark challenging questions for review, and reserve 10–15 minutes at the end to double-check your answers.',
        },
      ],
    },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-50 py-8">
      <div className="flex justify-center items-center w-[100vw]">
        {/* Main FAQ Card */}
        <div className="rounded-lg lg:w-[70vw] w-[90vw] bg-blue-600 p-8 text-white shadow-lg">
          {/* Header */}
          <h1 className="mb-6 text-2xl font-bold">Exam Preparation FAQ</h1>

          {/* Description */}
          <p className="mb-8 text-blue-100 leading-relaxed">
            Why Use FAQ? FAQ sections help students quickly find answers to
            common questions about exam preparation and study methods. It
            provides 24/7 self-service support for learners and reduces the need
            for direct support requests.
          </p>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {faqData.map((section) => (
              <div
                key={section.id}
                className=" border-blue-500 pb-6 last:border-b-0"
              >
                <div className="space-y-2">
                 {section.questions.map((item) => {
                const isActive = activeItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="border-b border-blue-500/30 py-1 mb-2 last:mb-0"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between text-left hover:text-blue-200 transition-colors"
                    >
                      <span className="text-lg font-semibold text-white">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-blue-200 transition-transform duration-200 flex-shrink-0 ${
                          isActive ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isActive && (
                      <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm ">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

                 
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center mt-8 gap-5">
            <p>My question is not here.</p>
            <button className="rounded bg-white px-2 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 transition-colors">
              Ask Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
