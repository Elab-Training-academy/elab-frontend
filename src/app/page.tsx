import React from 'react'
import Home from '../../src/Mainpage/Home'; 
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import Faq from '../component/Faq';
const page = () => {
  return (
    <div>
        <Navbar />
        <Home />
        <Faq />
        <Footer />
    </div>
  )
}

export default page