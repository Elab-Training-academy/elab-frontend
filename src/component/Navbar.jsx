'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import max from '../../src/image/logo.png';
import { FaLongArrowAltRight, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className='bg-white shadow-md sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 lg:h-20'>
            <div className='flex-shrink-0'>
            <Image
                src={max}
                alt="Description of the image"
                width={600}
                height={400}
                className="h-10 lg:h-12 w-auto mb-4"
            /> 
            </div>
            <ul className='hidden lg:flex items-center space-x-8 font-bold text-gray-700'>
              <li className='hover:text-blue-600 cursor-pointer transition-colors duration-200'>Home</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors duration-200'>Exam prep</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors duration-200'>Why us</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors duration-200'>Glossary</li>
              <a href='/contact'  className='hover:text-blue-600 cursor-pointer transition-colors duration-200'>Contact us</a>
            </ul>

        
            <div className='hidden lg:flex items-center space-x-4'>
              <button className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200'>
                <FaUser className='text-sm' />
                Profile
              </button>
              <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold'>
                Enroll Now
                <FaLongArrowAltRight className='text-sm' />
              </button>
            </div>

            
            <div className='lg:hidden'>
              <button
                onClick={toggleMenu}
                className='p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              >
                {isMenuOpen ? (
                  <FaTimes className='h-6 w-6' />
                ) : (
                  <FaBars className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>

       
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100 pb-6' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2'>
              <ul className='space-y-3 font-semibold text-gray-700 text-center'>
                <li className='block px-3 py-2 hover:text-blue-600 hover:bg-white rounded-md cursor-pointer transition-all duration-200'>
                  Home
                </li>
                <li className='block px-3 py-2 hover:text-blue-600 hover:bg-white rounded-md cursor-pointer transition-all duration-200'>
                  Exam prep
                </li>
                <li className='block px-3 py-2 hover:text-blue-600 hover:bg-white rounded-md cursor-pointer transition-all duration-200'>
                  Why us
                </li>
                <li className='block px-3 py-2 hover:text-blue-600 hover:bg-white rounded-md cursor-pointer transition-all duration-200'>
                  Glossary
                </li>
                <a href='/contact'  className='block px-3 py-2 hover:text-blue-600 hover:bg-white rounded-md cursor-pointer transition-all duration-200'>
                  Contact us
                </a>
              </ul>
              
              
              <div className='pt-4 space-y-3 border-t border-gray-200 flex flex-col items-center'>
                <button className='flex items-center justify-center gap-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200'>
                  <FaUser className='text-sm' />
                  Profile
                </button>
                {/* <button className='flex items-center justify-center gap-2 w-[20vw] bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'>
                  Enroll Now
                  <FaLongArrowAltRight className='text-sm' />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar