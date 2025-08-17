"use client";
import React from "react";

const FlashcardPage = () => {
  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Top Left Section */}
      <div className="flex flex-col items-start">
        <p className="text-[30px] font-semibold text-blue-600">Flashcards</p>
        <p className="text-gray-500 text-[14px]">Smart help when you need it, 24/7.</p>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">No cards here yet.</h1>
        <p className="text-gray-600">
          Start a study session by selecting a course category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-[20px] text-blue-600 font-semibold mb-2">Category 1</h2>
          <p className="text-gray-600 text-sm">
            Category details should be pasted here.
          </p>
        </div>

        <div className="bg-white  shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-[20px] text-blue-600 font-semibold mb-2">Category 2</h2>
          <p className="text-gray-600 text-sm">
            Category details should be pasted here.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-[20px] text-blue-600 font-semibold mb-2">Category 3</h2>
          <p className="text-gray-600 text-sm">
            Category details should be pasted here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
