'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import max from '../../src/image/logo.png';
import { FaLongArrowAltRight, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Exam prep', path: '/ExamPrep' },
    { name: 'why us', path: '/', section: 'why-us' },
    { name: 'Contact us', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Handle navigation click
  const handleNavClick = (path, section = null) => {
    if (section) {
      // If it's a section navigation, go to home first then scroll to section
      if (pathname !== '/') {
        router.push('/');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      } else {
        // Already on home page, just scroll to section
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    } else {
      router.push(path);
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          
          {/* Logo */}
          <a href='/' className='flex-shrink-0'>
            <Image
              src={max}
              alt="Logo"
              width={600}
              height={400}
              className="h-10 lg:h-12 w-auto mb-4"
            /> 
          </a>

          {/* Desktop Navigation */}
          <ul className='hidden lg:flex items-center space-x-8 font-bold text-gray-700'>
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.path, item.section)}
                  className={`cursor-pointer transition-colors duration-200 relative ${
                    isActive(item.path)
                      ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                      : 'hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons (Conditional) */}
          <div className='hidden lg:flex items-center space-x-4'>
            {isLoggedIn ? (
              <>
                <button className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200'>
                  <FaUser className='text-sm' />
                  Profile
                </button>
                <a href='/dashboard' className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold'>
                  Get started
                  <FaLongArrowAltRight className='text-sm' />
                </a>
              </>
            ) : (
              <>
                <a href='/login' className='px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200'>
                  Login
                </a>
                <a href='/register' className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold'>
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='lg:hidden'>
            <button
              onClick={toggleMenu}
              className='p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
            >
              {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className='px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2'>
            <ul className='space-y-3 font-semibold text-gray-700 text-center'>
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavClick(item.path, item.section)}
                    className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:text-blue-600 hover:bg-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Buttons (Conditional) */}
            <div className='pt-4 space-y-3 border-t border-gray-200 flex flex-col items-center'>
              {isLoggedIn ? (
                <>
                  <button className='flex items-center justify-center gap-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200'>
                    <FaUser className='text-sm' />
                    Profile
                  </button>
                  <a href='/dashboard' className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'>
                    Get Started
                    <FaLongArrowAltRight className='text-sm' />
                  </a>
                </>
              ) : (
                <>
                  <a href='/login' className='w-full text-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200'>
                    Login
                  </a>
                  <a href='/register' className='w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'>
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;