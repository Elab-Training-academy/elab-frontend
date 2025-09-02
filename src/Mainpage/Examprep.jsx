// "use client";

// import Link from "next/link";
// import { useAuthStore } from "../store/authStore";

// export default function ExamCategorySection() {
//   const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
//   const newToken = useAuthStore((state) => state.token);
//    const setToken = useAuthStore((state) => state.setToken);
//    const courses = useAuthStore((state) => state.courses);
//    const setCourses = useAuthStore((state) => state.setCourses);
//    const loading = useAuthStore((state) => state.loading);
//    const url = useAuthStore((state) => state.url);


//     useEffect(() => {
//        if (!newToken && localStorage.getItem("token")) {
//          setToken(localStorage.getItem("token"));
//        }
       
//      }, [newToken, setToken]);


//      useEffect(() => {
//          fetchAllCourses();
//        }, [fetchAllCourses]); 

//   return (
//     <section className="py-12 bg-white">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
//         {/* Heading */}
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
//           Select Your Exam Category
//         </h2>
//         <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-8">
//           Choose from our comprehensive selection of exam preparation courses designed to help you succeed in your healthcare career.
//         </p>

//         {/* Responsive grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map((cat, index) => (
//             <Link
//               href={cat.href}
//               key={index}
//               className="w-full p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <h3 className="font-[Inter] font-bold text-lg sm:text-xl text-[#2563EB] mb-2">
//                 {cat.title}
//               </h3>
//               <p className="font-[Geist] font-normal text-sm sm:text-base text-[#64748B]">
//                 {cat.description}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { useAuthStore } from "../store/authStore";

// export default function ExamCategorySection() {
//   const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
//   const newToken = useAuthStore((state) => state.token);
//   const setToken = useAuthStore((state) => state.setToken);
//   const courses = useAuthStore((state) => state.courses);
//   const loading = useAuthStore((state) => state.loading);

//   // ✅ Ensure token from localStorage
//   useEffect(() => {
//     if (!newToken && localStorage.getItem("token")) {
//       setToken(localStorage.getItem("token"));
//     }
//   }, [newToken, setToken]);

//   // ✅ Fetch courses on mount
//   useEffect(() => {
//     fetchAllCourses();
//   }, [fetchAllCourses]);

//   return (
//     <section className="py-12 bg-white">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
//         {/* Heading */}
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
//           Select Your Exam Category
//         </h2>
//         <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-8">
//           Choose from our comprehensive selection of exam preparation courses designed to help you succeed in your healthcare career.
//         </p>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading courses...</p>
//         ) : courses.length === 0 ? (
//           <p className="text-center text-gray-500">No courses available.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {courses.map((course) => (
//               <div
//                 key={course.id}
//                 className="w-full p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition duration-200"
//               >
//                 <h3 className="font-[Inter] font-bold text-lg sm:text-xl text-[#2563EB] mb-2">
//                   {course.title}
//                 </h3>
//                 <p className="font-[Geist] font-normal text-sm sm:text-base text-[#64748B] mb-4">
//                   {course.description}
//                 </p>

//                 <div className="flex justify-between items-center">
//                   <Link
//                     href={`/courses/${course.id}`}
//                     className="text-sm text-blue-600 font-medium hover:underline"
//                   >
//                     View Details
//                   </Link>
//                   <button
//                     onClick={() => alert(`Enrolled in ${course.title}`)}
//                     className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
//                   >
//                     Enroll
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
