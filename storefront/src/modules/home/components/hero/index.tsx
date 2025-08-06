"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, useEffect } from "react"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-full h-screen min-h-[800px] bg-[#171212] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F547aeb3cd3bc4fc58703324192505b17"
          alt="BBQ Chef with food"
          className="w-full h-full object-cover object-bottom"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>



      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto mb-8 sm:mb-16 md:mb-32 lg:mb-[199px] font-['Anek_Devanagari',sans-serif] pt-8 sm:pt-16 md:pt-24 lg:pt-[86px] mt-0 sm:mt-8 md:mt-16 lg:mt-[157px]">
          {/* Main Headline */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Heading
              level="h1"
              className="text-white/90 mb-1 uppercase font-['Anek_Devanagari',sans-serif] font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl pb-1 pt-4 sm:pt-8 md:pt-12 leading-tight"
              style={{ letterSpacing: "0.5px" }}
            >
              YANK DOWNUNDER
            </Heading>
          </div>

          {/* BBQ Text */}
          <div
            className={`transform transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Heading
              level="h1"
              className="text-white mb-2 font-['Anek_Devanagari',sans-serif] font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] py-2 sm:py-3 md:py-4 lg:py-6 leading-[0.8]"
              style={{
                letterSpacing: "-4px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                lineHeight: "0.75"
              }}
            >
              BBQ
            </Heading>
          </div>

          {/* Subtitle */}
          <div
            className={`transform transition-all duration-1000 ease-out delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Heading
              level="h2"
              className="text-white/90 mb-8 uppercase font-['Anek_Devanagari',sans-serif] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight"
              style={{ letterSpacing: "2px" }}
            >
              G'DAY Y'ALL
            </Heading>
          </div>

          {/* CTA Button */}
          <div
            className={`transform transition-all duration-1000 ease-out delay-600 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <LocalizedClientLink href="/store">
              <Button
                className="bg-[#8B7F00] hover:bg-[#9B8F00] text-white px-8 py-4 rounded-lg font-bold text-lg tracking-wide transition-all duration-200 transform hover:scale-105 uppercase shadow-lg mt-[18px]"
              >
                PRE-ORDER NOW
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-6 left-4 z-30">
        <button className="text-white p-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Hero
