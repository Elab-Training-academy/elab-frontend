"use client";
import React from "react";
import { Mic, Paperclip, Send } from "lucide-react";

const AIStudyCompanionPage = () => {
  return (
    <div className="p-6 flex flex-col h-full">

      <div className="flex flex-col items-start">
        <p className="text-[30px] font-semibold text-blue-600">AI Study Companion</p>
        <p className="text-gray-500 text-[14px]">Smart help when you need it, 24/7.</p>
      </div>


      <div className="flex flex-col items-center justify-center flex-1 mt-10">
        <h1 className="text-[30px] font-bold mb-4">Let's make your professional exam easier</h1>
        <p className="text-gray-600 font-mono mb-6">
          What do you want to learn today?
        </p>

        {/* Input Section */}
        <div className="bg-white shadow rounded-full flex items-center gap-3 px-4 py-2 w-full max-w-2xl">
          <button className="text-gray-500 hover:text-blue-600">
            <Mic size={22} />
          </button>

          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 border-none outline-none p-4 px-2 text-gray-700"
          />

          <button className="text-gray-500 hover:text-blue-600">
            <Paperclip size={22} />
          </button>

          <button className="text-blue-600 hover:text-blue-800">
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIStudyCompanionPage;
