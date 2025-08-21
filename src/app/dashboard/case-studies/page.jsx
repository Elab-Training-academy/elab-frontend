import React from "react";
import { HeartPulse, Activity, Thermometer, Droplet, Stethoscope } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col w-full min-h-screen p-6 bg-gray-100 gap-10">
      {/* Header */}
      <div>
        <p className="text-[30px] font-semibold text-blue-600">Case Studies</p>
        <p className="text-gray-500 text-[14px]">
          Advanced clinical reasoning and critical thinking practice
        </p>
      </div>

      {/* Patient Cards */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          <img
            src="https://via.placeholder.com/100"
            alt="Maria Rodriguez"
            className="rounded-full mx-auto"
          />
          <p className="text-center font-semibold mt-3">Maria Rodriguez</p>
          <p className="text-center text-gray-500">68 year old female</p>
          <p className="text-center text-sm mt-2">
            Admission: Chest pain and shortness of breath
          </p>
          <div className="flex justify-around items-center p-5 gap-6 ">
            <div className=" flex gap-3 flex-col ">
              <p className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> BP: 100/95
            </p>
              <p className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-blue-600" /> HR: 80
            </p>
               <p className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" /> RR: 24
            </p>
            </div>
            <div className=" flex gap-3 flex-col ">
            <p className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-600" /> Temp: 99.1°F
            </p>
            <p className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" /> O₂: 93%
            </p>
             <p className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-blue-600" /> Pain: 8/10
            </p>
            </div>
          </div>
          <div className="text-center">
            <button className="mt-4  border-2 border-[#7e7d7d] text-black p-1 w-[20vw]  rounded-[13px] hover:bg-blue-600 hover:text-white transition">
            Stat Case Study →
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          <img
            src="https://via.placeholder.com/100"
            alt="John Doe"
            className="rounded-full mx-auto"
          />
          <p className="text-center font-semibold mt-3">John Doe</p>
          <p className="text-center text-gray-500">72 year old male</p>
          <p className="text-center text-sm mt-2">
            Admission: Severe headache and dizziness
          </p>
          <div className="flex justify-around items-center p-5 gap-6 ">
            <div className=" flex gap-3 flex-col ">
              <p className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> BP: 160/95
            </p>
              <p className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-blue-600" /> HR: 90
            </p>
               <p className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" /> RR: 22
            </p>
            </div>
            <div className=" flex gap-3 flex-col ">
            <p className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-600" /> Temp: 99.1°F
            </p>
            <p className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" /> O₂: 95%
            </p>
             <p className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-blue-600" /> Pain: 90
            </p>
            </div>
          </div>
          <div className="text-center">
            <button className="mt-4  border-2 border-black text-black p-1 w-[20vw]  rounded-[13px] hover:bg-blue-600 hover:text-white transition">
            Stat Case Study →
            </button>
          </div>
        </div>
      </div>

      {/* Right Section BELOW Patient Cards */}
      <div className="flex  gap-6">
        <div className="bg-white p-6  border-2 border-black rounded-xl shadow-md">
          <p className="font-semibold">Critical Thinking</p>
          <p className="text-gray-500 text-sm mt-2">
            Develop systematic approaches to problem solving and diagnostics.
          </p>
        </div>
        <div className="bg-white p-6  border-2 border-black rounded-xl shadow-md">
          <p className="font-semibold">Clinical Reasoning</p>
          <p className="text-gray-500 text-sm mt-2">
            Practice prioritizing interventions based on patient conditions.
          </p>
        </div>
        <div className="bg-white  border-2 border-black p-6 rounded-xl shadow-md">
          <p className="font-semibold">Real-World Practice</p>
          <p className="text-gray-500 text-sm mt-2">
            Experience realistic clinical scenarios to sharpen your skills.
          </p>
        </div>
      </div>
    </div>
  );
}
