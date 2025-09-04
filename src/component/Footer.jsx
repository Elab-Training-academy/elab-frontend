'use client'
import React from 'react';
import Image from 'next/image';
import max from '../../src/image/logo.png';
import { FiFacebook, FiPhoneCall } from "react-icons/fi";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className='bg-gray-50 pt-16 pb-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
       
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pb-12 border-b-2 border-indigo-500'>
            
     
            <div className='space-y-6 justify-center'>
              <div class="flex-shrink-0 w-full flex-col flex items-center">
                <Image
                      src={max}
                      alt="Description of the image"
                      width={600}
                      height={400}
                      className="h-10 lg:h-12 w-auto mb-4"
                  />              
                  <p className='text-gray-600 leading-relaxed max-w-sm '>
                      Empowering nurses worldwide with AI-powered education and comprehensive exam preparation.
                    </p>
              </div>
              <div className='flex gap-4 justify-center'>
                <a href="#" className='p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200'>
                  <FiFacebook className='text-xl' />
                </a>
                <a href="#" className='p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200'>
                  <FaXTwitter className='text-xl' />
                </a>
                <a href="#" className='p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200'>
                  <FaLinkedin className='text-xl' />
                </a>
                <a href="#" className='p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200'>
                  <IoLogoInstagram className='text-xl' />
                </a>
              </div>
            </div>
            <div className='space-y-6'>
              <h1 className='font-bold text-xl text-gray-800'>Quick Links</h1>
              <ul className='space-y-3'>
                <li>
                  <a href="#about" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 block py-1'>
                    About us
                  </a>
                </li>
                <li>
                  <a href="/ExamPrep" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 block py-1'>
                    Course
                  </a>
                </li>
                {/* <li>
                  <a href="#" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 block py-1'>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 block py-1'>
                    Blog
                  </a>
                </li> */}
                <li>
                  <a href="/contact" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 block py-1'>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className='space-y-6 text-center'>
              <h1 className='font-bold text-xl text-gray-800'>Contact Us</h1>
              <div className='space-y-4 text-center'>
                <div className='text-gray-600'>
                  <p className='font-semibold text-gray-800 mb-1'>Nigeria:</p>
                  <p className='leading-relaxed'>4, Addo Road, Ajah, Lagos</p>
                </div>
                <div className='text-gray-600'>
                  <p className='font-semibold text-gray-800 mb-1'>USA:</p>
                  <p className='leading-relaxed'>828 Lane Allen Road 219, Lexington, Kentucky</p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-gray-600 justify-center'>
                  <FiPhoneCall className='text-indigo-600 text-lg flex-shrink-0' />
                  <div className='text-sm space-y-1 text-center'>
                    <a href="tel:+2348165634195" className='hover:text-indigo-600 block transition-colors duration-200'>
                      +234 816 563 4195
                    </a>
                    <a href="tel:+19294192327" className='hover:text-indigo-600 block transition-colors duration-200'>
                      +1 (929) 419-2327
                    </a>
                  </div>
                </div>
                <div className='flex items-center gap-3 text-gray-600 justify-center'>
                  <MdEmail className='text-indigo-600 text-lg flex-shrink-0' />
                  <a href="mailto:support@elabsolution.org" className='hover:text-indigo-600 transition-colors duration-200'>
                    support@elabsolution.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className='pt-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
            <p className='text-gray-600 text-center sm:text-left'>
              © {new Date().getFullYear()} ELAB Academy. All rights reserved.
            </p>
            
            <div className='flex gap-6 text-sm'>
              <a href="#" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200'>
                Privacy Policy
              </a>
              <a href="#" className='text-gray-600 hover:text-indigo-600 transition-colors duration-200'>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
