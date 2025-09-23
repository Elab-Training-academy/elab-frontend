"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { RefreshCw, Search } from "lucide-react";

const FlashcardPage = () => {
  const url = useAuthStore((state) => state.url);
  const { fetchUser } = useAuthStore();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        fetchUser();
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();
        const courseList = Array.isArray(data) ? data : data.courses || [];
        setCourses(courseList);

        if (courseList.length > 0) {
          setSelectedCourse(courseList[0].course_id || courseList[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [url, fetchUser]);

  // Fetch categories when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${url}/course-categories/${selectedCourse}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);

        if (data.length > 0) setSelectedCategory(data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [selectedCourse, url]);

  // Fetch flashcards when course/category changes
  useEffect(() => {
    if (!selectedCourse || !selectedCategory) return;
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${url}/flash-cards/course/question`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_id: selectedCourse,
            course_category_id: selectedCategory,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch flashcards");
        const data = await res.json();

        setFlashcards(data);
        setFilteredFlashcards(data);
        setCurrentIndex(0);
        setFlipped(false);
      } catch (err) {
        console.error(err);
        setFlashcards([]);
        setFilteredFlashcards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [selectedCourse, selectedCategory, url]);

  // Filter flashcards by search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlashcards(flashcards);
      setCurrentIndex(0);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const results = flashcards.filter(
      (card) =>
        card.question.toLowerCase().includes(lower) ||
        card.answer.toLowerCase().includes(lower) ||
        (card.note && card.note.toLowerCase().includes(lower))
    );
    setFilteredFlashcards(results);
    setCurrentIndex(0);
  }, [searchTerm, flashcards]);

  const handleFlip = () => setFlipped((prev) => !prev);
  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlipped(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 gap-8">
      {/* Search */}
      <div className="w-full max-w-xl mx-auto flex items-center bg-white shadow px-4 py-3 rounded-xl">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Course & Category selectors */}
      <div className="flex flex-wrap gap-4 w-full max-w-xl mx-auto">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {courses.map((c) => (
            <option key={c.id || c.course_id} value={c.course_id || c.id}>
              {c.title || c.name || "Untitled Course"}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title || cat.name || "Untitled Category"}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Loading flashcards...
        </div>
      )}

      {/* Empty */}
      {!loading && filteredFlashcards.length === 0 && (
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">No cards found.</h1>
          <p className="text-gray-600">Try searching or select another category.</p>
        </div>
      )}

      {/* Flashcard */}
      {!loading && filteredFlashcards.length > 0 && (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
          <p className="text-sm text-gray-600">
            {currentIndex + 1} / {filteredFlashcards.length} Cards
          </p>

          <div
            onClick={handleFlip}
            className="relative w-full h-60 sm:h-72 cursor-pointer perspective"
          >
            <div
              className={`transition-transform duration-500 transform preserve-3d w-full h-full ${
                flipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 bg-white shadow-lg rounded-xl p-6 flex items-center justify-center text-center backface-hidden">
                <p className="text-gray-800 font-semibold text-lg">
                  {filteredFlashcards[currentIndex].question}
                </p>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-blue-600 text-white rounded-xl p-6 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden">
                <p className="font-semibold text-lg">
                  {filteredFlashcards[currentIndex].answer}
                </p>
                {filteredFlashcards[currentIndex].note && (
                  <p className="text-sm mt-3 text-blue-100 italic">
                    Note: {filteredFlashcards[currentIndex].note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {!flipped && <p className="text-gray-500 text-sm">Tap to reveal the answer ↓</p>}

          <div className="flex justify-between w-full">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredFlashcards.length - 1}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardPage;
