// app/page.jsx
"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, Eye, EyeOff, Edit, Trash2, BookOpen } from "lucide-react";
import AddFlashcardModal from "../../../component/AddFlashcardModal";

export default function Flashcards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [hiddenCategories, setHiddenCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data - flashcards
  const [flashcards] = useState([
    {
      id: 1,
      category: "Cardiology",
      question: "What is the normal heart rate range for adults?",
      answer: "60-100 beats per minutes at rest",
      createdOn: "03/15/2025",
      isHidden: false
    },
    // ... other flashcards
  ]);

  // Group flashcards by category
  const groupedFlashcards = flashcards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {});

  // Toggle category visibility
  const toggleCategoryVisibility = (category) => {
    setHiddenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Academy Name */}
      <div className="bg-white border-b p-3 md:p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs md:text-sm text-gray-500 font-medium">© ELAe Academy</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage all your flashcards here</p>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-4 md:mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Search size={18} className="mr-2" /> Search flashcards
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  className="w-full pl-10 pr-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative flex-1 md:w-48">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Cardiology</option>
                  <option>Pharmacology</option>
                  <option>Anatomy</option>
                  <option>Physiology</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Create New Flashcard
              </button>
            </div>
          </div>
        </div>

        {/* Flashcards List */}
        <div className="space-y-4">
          {Object.entries(groupedFlashcards).map(([category, cards]) => (
            <div key={category} className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Category Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                <button 
                  onClick={() => toggleCategoryVisibility(category)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  {hiddenCategories[category] ? (
                    <>
                      <Eye size={16} /> Show
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} /> Hide
                    </>
                  )}
                </button>
              </div>
              
              {/* Flashcards for this category */}
              {!hiddenCategories[category] && (
                <div className="p-4 space-y-4">
                  {cards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Question</h4>
                        <p className="text-gray-800">{card.question}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Answer</h4>
                        <p className="text-gray-800">{card.answer}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Created on: {card.createdOn}</span>
                        
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                            <Edit size={14} /> Edit
                          </button>
                          <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State (if no flashcards) */}
        {flashcards.length === 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <p className="text-gray-600 mb-2 text-lg">
                No flashcards found
              </p>
              <p className="text-gray-500 mb-6 max-w-md">
                Get started by creating your first flashcard
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} /> Create New Flashcard
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <AddFlashcardModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}