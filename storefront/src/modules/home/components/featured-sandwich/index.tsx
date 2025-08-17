import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FeaturedSandwich = () => {
  return (
    <section className="w-full bg-white py-[60px] px-4 sm:px-[78px] flex flex-col justify-center items-center gap-8">
      <div className="bg-[#DDE7F2] flex flex-col lg:flex-row max-w-[1230px] w-full pt-[18px] justify-center items-center rounded-lg shadow-[0px_6px_18px_0px_rgba(0,0,0,0.25)] overflow-hidden min-h-[555px]">
        {/* Left Side - Main Sandwich Image */}
        <div className="flex justify-center items-center bg-[#DDE7F2] rounded-lg lg:rounded-none lg:rounded-l-lg pl-0 lg:pl-[47px] pb-[18px] lg:pb-[18px] pr-[2px]">
          <div className="w-full lg:w-[515px] h-auto lg:h-[483px] flex justify-center items-center rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8d9d7d4abd363b2d2b708515a3416dad00371621?width=1030"
              alt="Smoked Brisket Sandwich"
              className="w-full h-auto lg:w-[515px] lg:h-[483px] object-cover rounded-lg"
              style={{ aspectRatio: '161/151' }}
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 bg-[#DDE7F2] p-6 lg:pl-[33px] lg:pr-6 lg:py-0 flex items-center">
          <div className="flex flex-col items-start gap-[19px] w-full max-w-[523px]">
            {/* Title */}
            <div className="w-full h-auto lg:h-[145px] flex flex-col justify-center">
              <h2 className="text-[#192D61] font-['Anek_Devanagari',sans-serif] font-bold text-2xl sm:text-3xl lg:text-[48px] leading-tight lg:leading-[58px] capitalize">
                Featured Dish: Brisket Sandwich
              </h2>
            </div>

            {/* Description */}
            <div className="w-full">
              <p className="text-[#192D61] font-['Inter',sans-serif] font-normal text-base lg:text-[18px] leading-6 lg:leading-[24px]">
                Sink your teeth into our 14-hour iron-bark smoked brisket sandwich, stacked on a sweet brioche bun. Purchase with creamy potato salad and cookie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Online Button */}
      <div className="w-full flex justify-center">
        <LocalizedClientLink href="/store">
          <button className="bg-[#636CBE] hover:bg-[#5A5AAE] text-white px-5 py-0 rounded-full font-bold text-base leading-6 font-['Anek_Devanagari',sans-serif] capitalize w-[250px] h-[50px] flex items-center justify-center border-0 outline-none transition-colors duration-200">
            Order Online &gt;
          </button>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default FeaturedSandwich
