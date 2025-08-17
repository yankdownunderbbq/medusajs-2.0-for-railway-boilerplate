"use client"

const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="flex flex-col w-full">
        <div className="relative w-full">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/c523da26b972ede7e89ff5143ab368d5a02e2b11?width=2558"
            alt="Hero image"
            className="w-full h-auto min-h-[480px] sm:min-h-[600px] md:min-h-[689px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
