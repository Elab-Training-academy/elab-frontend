import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa"; 

const Trial = () => {
  return (
    <div className="bg-blue-600 flex flex-col justify-center items-center text-center p-[7%] text-white  shadow-md">
      <h1 className="font-bold text-2xl md:text-3xl mb-4">
        Ready to Start Your Success Journey?
      </h1>
      <p className="mb-6 text-sm md:text-base">
        Join 15,000+ nursing students who are already preparing with ELAB Academy
      </p>
      <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-[10px] flex items-center gap-2 hover:bg-gray-100 transition">
        Start Free Trial <FaLongArrowAltRight className="text-lg" />
      </button>
    </div>
  )
}

export default Trial
