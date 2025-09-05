// "use client";
// import React, { useEffect, useState } from "react";
// import { Search, Bell, Clock } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";

// const QuestionBank = () => {
//   const url = useAuthStore(state => state.url);
//   const newToken = useAuthStore(state => state.token)
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getToken = localStorage.getItem('token')
//   console.log(getToken);
  

//   // Fetch questions from API
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await fetch(`${url}/questions`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${getToken}`,
//           }
//         })
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const data = await res.json();
        
//         // Check if data is an array, if not, try to extract questions from response
//         if (Array.isArray(data)) {
//           setQuestions(data);
//         } else if (data.questions && Array.isArray(data.questions)) {
//           setQuestions(data.questions);
//         } else if (data.data && Array.isArray(data.data)) {
//           setQuestions(data.data);
//         } else {
//           console.error("Unexpected API response structure:", data);
//           setError("Unexpected data format received from server");
//           setQuestions([]); // Set to empty array to prevent map error
//         }
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError(err.message);
//         setQuestions([]); // Set to empty array to prevent map error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [url, getToken]); // Added dependencies

//   // ... rest of your component code remains the same until the return statement

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Type a command or search..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <Bell className="w-6 h-6 text-gray-600" />
//         </div>

//         {/* Title */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Question Bank</h1>
//           <p className="text-gray-600 text-lg max-w-4xl">
//             Select a practice mode to match your learning style.
//           </p>
//         </div>

//         {/* Questions Section */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">
//             All Questions
//           </h2>

//           {loading ? (
//             <p className="text-gray-500">Loading questions...</p>
//           ) : error ? (
//             <p className="text-red-500">Error: {error}</p>
//           ) : questions.length === 0 ? (
//             <p className="text-gray-500">No questions available.</p>
//           ) : (
//             <div className="space-y-6">
//               {questions.map((q, index) => (
//                 <div
//                   key={q.id || index}
//                   className="p-4 border border-gray-200 rounded-xl bg-gray-50"
//                 >
//                   <h3 className="font-medium text-gray-900 mb-2">
//                     {index + 1}. {q.question_text}
//                   </h3>
//                   <ul className="space-y-2">
//                     {q.answer_options && q.answer_options.map((opt) => (
//                       <li
//                         key={opt.id || opt.option_text}
//                         className="flex items-center space-x-2 text-gray-700"
//                       >
//                         <input
//                           type={
//                             q.answer_type === "select_all"
//                               ? "checkbox"
//                               : "radio"
//                           }
//                           name={q.id}
//                           value={opt.option_text}
//                           className="text-blue-600"
//                         />
//                         <span>{opt.option_text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionBank;



"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";

const QuestionBank = () => {
  const { id } = useParams(); // course_id
  const url = useAuthStore((state) => state.url);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${url}/courses/${id}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch modules:", res.status);
          setModules([]);
          return;
        }

        const data = await res.json();
        console.log("Modules response:", data);

        if (Array.isArray(data)) {
          setModules(data);
        } else if (data.modules) {
          setModules(data.modules);
        } else {
          setModules([]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchModules();
  }, [id, url]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Question Bank
          </h1>
          <p className="text-gray-600 text-lg max-w-4xl">
            Select a module to see its questions.
          </p>
        </div>

        {/* Modules */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Modules
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading modules...</p>
          ) : modules.length === 0 ? (
            <p className="text-gray-500">No modules available.</p>
          ) : (
            <div className="space-y-6">
              {modules.map((m, index) => (
                <div
                  key={m.id || index}
                  className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-blue-50 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {index + 1}. {m.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order: {m.order_number} | Duration:{" "}
                    {m.duration ?? "N/A"} mins | Pass Mark:{" "}
                    {m.pass_mark ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
