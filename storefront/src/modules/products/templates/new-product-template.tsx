"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductImageCarousel from "@modules/products/components/ProductImageCarousel"
import ProductVariantSelector from "@modules/products/components/ProductVariantSelector"
import ProductFeatures from "@modules/products/components/ProductFeatures"
import ProductInformation from "@modules/products/components/ProductInformation"
import { addToCart } from "@lib/data/cart"

type NewProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

// Type definitions for metadata structure
type FeatureItem = {
  icon: string
  label: string
  description: string
}

type ProductMetadata = {
  features?: FeatureItem[]
  backstory?: string
  ingredients?: string
  usage_instructions?: string
  "usage instructions"?: string // Keep both for compatibility
}

const NewProductTemplate: React.FC<NewProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  const currentCountryCode = countryCode
  
  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | null>(
    product.variants?.[0] || null
  )

  if (!product || !product.id) {
    return notFound()
  }

  // Transform Medusa variants to match ProductVariantSelector expected format
  const variantSelectorData = product.variants?.map(variant => {
    // Extract price from calculated_price object
    const priceAmount = variant.calculated_price?.calculated_amount || variant.calculated_price?.amount || 0
    const price = priceAmount / 100 // Convert from cents to dollars
    
    return {
      id: variant.id,
      title: variant.title || `${variant.sku || 'Variant'}`,
      price: price,
      inventory_quantity: 10 // Temporarily force all variants to be available for testing
    }
  }) || []


  // Handle variant selection
  const handleVariantChange = (variant: any) => {
    const medusaVariant = product.variants?.find(v => v.id === variant.id)
    setSelectedVariant(medusaVariant || null)
  }

  // Handle add to cart
  const handleAddToCart = async (variant: any) => {
    if (!variant?.id) return

    try {
      await addToCart({
        variantId: variant.id,
        quantity: 1,
        countryCode: currentCountryCode,
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  // Parse metadata safely - handle both object and JSON string
  let metadata: ProductMetadata = {}
  
  try {
    if (typeof product.metadata === 'string') {
      metadata = JSON.parse(product.metadata) as ProductMetadata
    } else if (product.metadata && typeof product.metadata === 'object') {
      metadata = product.metadata as ProductMetadata
    }
  } catch (error) {
    console.warn('Failed to parse product metadata:', error)
    metadata = {}
  }
  
  const metadataFeatures = metadata.features || []
  const backstory = metadata.backstory || ""
  const ingredients = metadata.ingredients || ""
  const usageInstructions = metadata.usage_instructions || metadata["usage instructions"] || ""

  // Transform metadata features to ProductFeatures component format
  const productFeatures = metadataFeatures.map((feature, index) => ({
    id: `feature-${index}`,
    label: feature.label,
    icon: (
      <img 
        src={feature.icon} 
        alt={feature.label}
        className="w-full h-full object-contain"
      />
    )
  }))

  // Transform metadata to ProductInformation tabs
  const informationTabs = []
  
  // Add product description as first tab
  if (product.description) {
    informationTabs.push({
      id: "description",
      title: "Description",
      content: product.description
    })
  }
  
  if (backstory) {
    informationTabs.push({
      id: "backstory",
      title: "Our Story",
      content: backstory
    })
  }
  
  if (ingredients) {
    informationTabs.push({
      id: "ingredients",
      title: "Ingredients & Sourcing",
      content: ingredients
    })
  }
  
  if (usageInstructions) {
    informationTabs.push({
      id: "usage",
      title: "Storage & Preparation",
      content: usageInstructions
    })
  }


  return (
    <div>
      {/* Product Title */}
      <h1>{product.title}</h1>
      
      {/* Product Image Carousel */}
      <ProductImageCarousel images={product.images || []} />

      {/* Product Variant Selector */}
      {variantSelectorData.length > 0 && (
        <ProductVariantSelector
          variants={variantSelectorData}
          onVariantChange={handleVariantChange}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Features Section */}
      <ProductFeatures features={productFeatures} />

      {/* Product Information Tabs */}
      <ProductInformation tabs={informationTabs} />

    </div>
  )
}

export default NewProductTemplate