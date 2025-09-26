"use client";
import { useEffect, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";

export default function CatPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/cat-questions?limit=20&skip=0",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // if token required
            },
          }
        );
        const data = await res.json();
        setTests(data); // depends on API response structure
      } catch (err) {
        console.error("Error fetching CAT questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">NCLEX- RN CAT</h1>
        <p className="text-gray-500">Manage Computer Adaptive Testing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500">Total Test</p>
            <h2 className="text-xl font-bold">{tests.length}</h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500">Categories</p>
            <h2 className="text-xl font-bold">
              {new Set(tests.map((t) => t.category)).size}
            </h2>
          </div>
        </div>
      </div>

      {/* Search + Filter + Create */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto items-center gap-2 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Computer Adaptive Testing"
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="border rounded-lg py-2 px-3 text-sm">
            <option>All Categories</option>
            {Array.from(new Set(tests.map((t) => t.category))).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create CAT Test
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tests.map((test, index) => (
                <tr key={test.id || index}>
                  <td className="px-6 py-3">{test.name || `CAT Test ${index + 1}`}</td>
                  <td className="px-6 py-3">{test.category || "N/A"}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                      {test.status || "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex items-center gap-2">
                    <select className="border rounded-lg py-1 px-2 text-sm">
                      <option>Actions</option>
                      <option>Publish</option>
                      <option>Move to draft</option>
                      <option>Delete</option>
                    </select>
                    <button className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-500">
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-lg text-gray-400" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border rounded-lg text-gray-400" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
