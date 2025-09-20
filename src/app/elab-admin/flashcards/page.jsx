// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, Eye, EyeOff, Edit, Trash2, BookOpen } from "lucide-react";
import AddFlashcardModal from "../../../component/AddFlashcardModal";
import DeleteConfirmationModal from "../../../component/DeleteConfirmationModal";
import EditFlashcardModal from "../../../component/EditFlashcardModal";

export default function Flashcards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [hiddenCategories, setHiddenCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [editModalLoading, setEditModalLoading] = useState(false);

  // Fetch all flashcards from API
  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch("https://elab-server-xg5r.onrender.com/flash-cards/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFlashcards(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      setError("Failed to load flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single flashcard by ID
  const fetchSingleFlashcard = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`https://elab-server-xg5r.onrender.com/flash-cards/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error fetching single flashcard:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (card) => {
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCardToDelete(null);
    setDeletingId(null);
  };

  // Open edit modal with latest data
  const openEditModal = async (card) => {
    setEditModalLoading(true);
    try {
      // Fetch the latest data from the server before opening the edit modal
      const latestCard = await fetchSingleFlashcard(card.id);
      setCardToEdit(latestCard);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Error fetching flashcard for editing:", err);
      // If fetching fails, use the local data as fallback
      setCardToEdit(card);
      setIsEditModalOpen(true);
      setError("Could not fetch latest data. Editing local copy.");
    } finally {
      setEditModalLoading(false);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCardToEdit(null);
    setUpdatingId(null);
  };

  // Delete flashcard function
  const deleteFlashcard = async () => {
    if (!cardToDelete) return;

    try {
      setDeletingId(cardToDelete.id);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        closeDeleteModal();
        return;
      }

      const response = await fetch(`https://elab-server-xg5r.onrender.com/flash-cards/${cardToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted flashcard from state
      setFlashcards(prev => prev.filter(card => card.id !== cardToDelete.id));
      closeDeleteModal();
      
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      setError("Failed to delete flashcard. Please try again.");
      closeDeleteModal();
    }
  };

  // Update flashcard function
  const updateFlashcard = async (updatedData) => {
    if (!cardToEdit) return;

    try {
      setUpdatingId(cardToEdit.id);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        closeEditModal();
        return;
      }

      const url = `https://elab-server-xg5r.onrender.com/flash-cards/${cardToEdit.id}`;
      
      // Try different HTTP methods
      const methods = ["PUT", "POST", "PATCH"];
      let lastError = null;

      for (const method of methods) {
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData)
          });

          if (response.ok) {
            const updatedFlashcard = await response.json();
            
            // Update the flashcard in state
            setFlashcards(prev => prev.map(card => 
              card.id === cardToEdit.id ? { ...card, ...updatedFlashcard } : card
            ));
            
            closeEditModal();
            return;
          } else {
            const errorText = await response.text();
            lastError = new Error(`${method} failed: ${response.status} - ${errorText}`);
          }
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error("All update methods failed");
      
    } catch (err) {
      console.error("Error updating flashcard:", err);
      setError(`Failed to update flashcard: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Group flashcards by category with null check
  const groupedFlashcards = flashcards.reduce((acc, card) => {
    const category = card.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});

  // Toggle category visibility
  const toggleCategoryVisibility = (category) => {
    setHiddenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter flashcards based on search query and category filter
  const filteredFlashcards = Object.entries(groupedFlashcards).filter(([category]) => {
    const matchesSearch = category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for dropdown with null safety
  const uniqueCategories = Array.from(new Set(flashcards
    .map(card => card.category)
    .filter(category => category && category.trim() !== "")
  ));

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
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
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

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Flashcards List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredFlashcards.map(([category, cards]) => (
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
                          <span className="text-xs text-gray-500">
                            Created on: {new Date(card.createdOn || card.created_at).toLocaleDateString()}
                          </span>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openEditModal(card)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button 
                              onClick={() => openDeleteModal(card)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                            >
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
        )}

        {/* Empty State (if no flashcards) */}
        {!loading && !error && flashcards.length === 0 && (
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

        {/* Add Flashcard Modal */}
        <AddFlashcardModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onFlashcardAdded={fetchFlashcards}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteFlashcard}
          isLoading={deletingId !== null}
          flashcard={cardToDelete}
        />

        {/* Edit Flashcard Modal */}
        <EditFlashcardModal 
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={updateFlashcard}
          isLoading={updatingId !== null}
          isFetching={editModalLoading}
          flashcard={cardToEdit}
        />
      </div>
    </div>
  );
}