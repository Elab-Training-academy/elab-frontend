import React from 'react'
import Firsthero from '../Mainpage/Firsthero'
import HeroSection from '../Mainpage/HeroSection'
import Testimonial from '../Mainpage/Testimonial'
import WhyElab from '../Mainpage/WhyElab'
import AboutElab from '../Mainpage/AboutElab'

const Home = () => {
  return (
    <>
        <HeroSection />
        <AboutElab />
        <Firsthero />
         <WhyElab />
        <Testimonial />      
    </>
  )
}

export default Home