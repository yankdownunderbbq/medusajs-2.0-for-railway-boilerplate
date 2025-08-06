"use client"

const testimonials = [
  {
    id: 1,
    text: "OMG, YUM!",
    author: "Sara",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/e6230c2a63e91c6757e91ddd412afba044c092b8?width=150"
  },
  {
    id: 2,
    text: "Many expressions of approval!!!",
    author: "Graeme", 
    image: "https://api.builder.io/api/v1/image/assets/TEMP/1310e68b7d970c0a6cb53fc224c2aaac9b1063af?width=150"
  },
  {
    id: 3,
    text: "Highly Recommend!",
    author: "Georgie",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/be577a3cc5f52af0478f65448dd1733ea7f3bf29?width=150"
  }
]

const Testimonials = () => {
  return (
    <section className="w-full bg-black py-5 px-4 sm:px-8 lg:px-40">
      <div className="max-w-[960px] mx-auto">
        {/* Section Title */}
        <div className="px-4 pb-3 pt-5">
          <h2
            className="text-[#878ECD] uppercase font-bold text-2xl sm:text-3xl lg:text-4xl leading-7 font-['Anek_Devanagari',sans-serif]"
          >
            Word on the Street
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="px-4 pt-4">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-[#4F4540] bg-[#DDE7F2] min-h-[200px]"
              >
                {/* Profile Image */}
                <img 
                  src={testimonial.image}
                  alt={`${testimonial.author} testimonial`}
                  className="w-[75px] h-[75px] rounded-full object-cover"
                />
                
                {/* Testimonial Content */}
                <div className="w-full max-w-[215px] text-center">
                  <p className="text-[#636CBE] font-bold text-base leading-5 font-sans">
                    {testimonial.text}
                  </p>
                  <p className="text-[#636CBE] font-bold text-base leading-5 font-sans mt-0">
                    -{testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
