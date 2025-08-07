import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Testimonials from "@modules/home/components/testimonials"
import PreOrderExclusives from "@modules/home/components/pre-order-exclusives"
import FeaturedSandwich from "@modules/home/components/featured-sandwich"
import PopupLocation from "@modules/home/components/popup-location"
import CateringQuote from "@modules/home/components/catering-quote"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  // Fetch products for pre-order exclusives
  const { response: { products } } = await getProductsList({
    pageParam: 1,
    queryParams: { limit: 6 },
    countryCode,
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedSandwich />
      <PreOrderExclusives region={region} products={products} />
      <PopupLocation />
      <Testimonials />
      <CateringQuote />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
