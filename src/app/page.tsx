import React from 'react'
import Home from '../../src/Mainpage/Home'; 
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
const page = () => {
  return (
    <div>
        <Navbar />
        <Home />
        <Footer />
    </div>
  )
}

export default page