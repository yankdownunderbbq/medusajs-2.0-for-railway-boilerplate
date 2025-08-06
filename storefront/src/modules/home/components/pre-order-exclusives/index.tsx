import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductsById } from "@lib/data/products"
import { Button } from "@medusajs/ui"

async function ProductCard({ 
  product, 
  region 
}: { 
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion 
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group flex-1">
      <div className="flex flex-col pb-3 gap-3">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img 
            src={product.thumbnail || "https://api.builder.io/api/v1/image/assets/TEMP/a1504300a442a8a968336addcc2af5269af931c7?width=602"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#192D61] font-['Anek_Devanagari',sans-serif] text-lg font-medium leading-6">
            {product.title}
          </h3>
          <p className="text-[#636CBE] font-['Anek_Devanagari',sans-serif] text-base leading-[21px]">
            {product.description || "Premium quality BBQ, smoked to perfection."}
          </p>
          {cheapestPrice && (
            <p className="text-[#636CBE] font-sans text-base leading-[21px]">
              {cheapestPrice.calculated_price}
            </p>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default async function PreOrderExclusives({
  region,
  products,
}: {
  region: HttpTypes.StoreRegion
  products: HttpTypes.StoreProduct[]
}) {
  // Take only first 3 products for display
  const displayProducts = products.slice(0, 3)

  return (
    <section className="w-full bg-white py-5 px-4 sm:px-8 lg:px-40">
      <div className="max-w-[960px] mx-auto">
        {/* Section Title */}
        <div className="px-4 pb-3 pt-5">
          <h2 className="text-[#878ECD] uppercase font-bold text-2xl sm:text-3xl lg:text-4xl leading-7 font-['Anek_Devanagari',sans-serif]">
            Pre-Order Exclusives
          </h2>
        </div>

        {/* Subtitle */}
        <div className="px-4 pb-3">
          <p className="text-[#636CBE] font-['Anek_Devanagari',sans-serif] text-xl leading-6">
            Only available at our next pop-up. When it's gone, it's gone.
          </p>
        </div>

        {/* Products Grid */}
        <div className="px-4 pt-4">
          <div className="flex flex-col md:flex-row gap-3 mb-10">
            {displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                region={region} 
              />
            ))}
          </div>

          {/* Order Online Button */}
          <div className="flex justify-center">
            <LocalizedClientLink href="/store">
              <Button className="bg-[#636CBE] hover:bg-[#5A5AAE] text-white px-5 py-3 rounded-lg font-bold text-base leading-6 font-['Anek_Devanagari',sans-serif] uppercase min-w-[173px] h-12">
                BUILD YOUR ORDER
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
