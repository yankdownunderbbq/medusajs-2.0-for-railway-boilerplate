const PopupLocation = () => {
  const address = "246 Boundary Rd, Braeside VIC 3195, Australia"
  const googleMapsQuery = "turn left @ albuquerque"
  const googleMapsUrl = `https://maps.app.goo.gl/PA4atAjx9po9Jrhf6`

  return (
    <section className="w-full bg-white py-5">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-1 max-w-[1232px] mx-auto">
          {/* Left Side - Map */}
          <div className="w-full lg:max-w-[920px] flex-1">
            <div className="flex flex-col">
              {/* Title */}
              <div className="py-5 px-4">
                <h2 className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl lg:text-[22px] leading-7">
                  Where to find us
                </h2>
              </div>
              
              {/* Map Container */}
              <div className="px-4 pb-3">
                <div className="h-[300px] lg:h-[470px] w-full rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBsh-153ufzhgO2iEm9rYI2eLtWznTqfvU&q=${encodeURIComponent(address)}&zoom=14`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Event Details */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="flex flex-col">
              {/* Event Details Title */}
              <div className="py-5 px-4">
                <h2 className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl lg:text-[22px] leading-7">
                  Event Details
                </h2>
              </div>

              {/* Address */}
              <div className="min-h-[56px] px-4 flex justify-between items-center bg-white">
                <div className="flex flex-col">
                  <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {address}
                  </a>
                </div>
              </div>

              {/* Popup Date */}
              <div className="min-h-[56px] px-4 flex justify-between items-center bg-white">
                <div className="flex flex-col flex-1">
                  <span className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6">
                    Popup Date
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6">
                    July 20, 2024
                  </span>
                </div>
              </div>

              {/* Popup Start Time */}
              <div className="min-h-[56px] px-4 flex justify-between items-center bg-white">
                <div className="flex flex-col flex-1">
                  <span className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6">
                    Popup Start Time
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6">
                    12:00 PM
                  </span>
                </div>
              </div>

              {/* About the Venue */}
              <div className="py-5 px-4">
                <h3 className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl lg:text-[22px] leading-7">
                  About the Venue
                </h3>
              </div>

              {/* Venue Description */}
              <div className="px-4 pb-3">
                <p className="text-[#121417] font-['Plus_Jakarta_Sans',sans-serif] font-normal text-base leading-6">
                  Join us at the vibrant Braeside venue, known for its spacious outdoor setting and lively atmosphere. This location offers the perfect backdrop for our BBQ pop-up, with ample room for guests to mingle and enjoy the delicious food. The venue is easily accessible and provides a relaxed environment, making it ideal for a fun-filled day of BBQ and community.
                </p>
              </div>

              {/* Venue Image */}
              <div className="p-4 bg-white">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/e736bede918ee7699e19752b7c3bfe42bfb2a4bc?width=656"
                    alt="Venue outdoor dining area"
                    className="h-[219px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopupLocation
