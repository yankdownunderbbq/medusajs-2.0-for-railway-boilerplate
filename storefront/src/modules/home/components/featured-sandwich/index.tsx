import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FeaturedSandwich = () => {
  return (
    <section className="w-full bg-[#DDE7F2] py-10 px-7">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row max-w-[1230px] mx-auto justify-center items-center rounded-lg shadow-[0px_6px_18px_0px_rgba(0,0,0,0.25)] overflow-hidden bg-white">
          {/* Left Side - Image */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/85e0d1e006765863199b76cb623de26c5f139945?width=1294"
              alt="Brisket Sandwich"
              className="w-full lg:w-[647px] h-[300px] lg:h-[635px] object-cover"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 bg-[#DDE7F2] p-6 lg:pl-12 lg:pr-6 lg:py-12 flex items-center min-h-[635px]">
            <div className="flex flex-col items-start gap-6 lg:gap-3 w-full">
              {/* Title */}
              <div className="w-full max-w-[523px]">
                <h2 className="text-[#192D61] font-['Anek_Devanagari',sans-serif] font-bold text-2xl sm:text-3xl lg:text-[48px] leading-tight lg:leading-[58px] uppercase">
                  popup feature: Brisket Sandwich
                </h2>
              </div>

              {/* Description */}
              <div className="w-full max-w-[475px] mb-2">
                <p className="text-[#192D61] font-['Anek_Devanagari',sans-serif] font-bold text-sm lg:text-base leading-6 lg:leading-7">
                  Sink your teeth into our 14-hour hickory-smoked brisket sandwich—stacked on a toasted brioche bun with tangy slaw and our signature BBQ sauce. Comes with creamy potato salad and a cookie for dessert.
                </p>
              </div>

              {/* Side Images */}
              <div className="w-full max-w-[462px] flex flex-col sm:flex-row items-start gap-4 lg:gap-6 mb-4">
                <div className="flex-1 py-4">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/56000288528e659336e86dd595103518f7f13881?width=438"
                    alt="Potato Salad Side Dish"
                    className="h-[120px] lg:h-[165px] w-full aspect-[219/165] rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 py-4">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/56000288528e659336e86dd595103518f7f13881?width=438"
                    alt="Potato Salad Side Dish"
                    className="h-[120px] lg:h-[165px] w-full aspect-[219/165] rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Order Button */}
              <div className="w-full">
                <LocalizedClientLink href="/store">
                  <Button className="bg-[#636CBE] hover:bg-[#5A5AAE] text-white px-5 py-3 rounded-lg font-bold text-base leading-6 font-['Anek_Devanagari',sans-serif] uppercase min-w-[173px] h-12">
                    RESERVE YOUR PLATE
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSandwich
