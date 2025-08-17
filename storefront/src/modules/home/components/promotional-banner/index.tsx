"use client"

import { useState, useEffect } from "react"

const PromotionalBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      className="relative w-full bg-white sm:pt-[11px] sm:pb-1 pt-[25px] pb-4"
    >
      <div className="max-w-[1280px] mx-auto" style={{ padding: "0 200px 0 16px" }}>
        <div className="flex items-center justify-center">
          <div
            className={`transform transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/14b4ce387620c5825c0f27cb4fd55643d30faf62?width=1802"
                alt="Real American Low N' Slow BBQ"
                className="w-full max-w-[901px] h-auto object-contain"
                style={{ aspectRatio: "901/389" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromotionalBanner
