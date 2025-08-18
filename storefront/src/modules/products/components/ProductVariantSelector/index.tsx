"use client"

import { Container, clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import React, { useState, useEffect } from "react"

type ProductVariant = {
  id: string
  title: string
  price: number
  inventory_quantity?: number
}

type ProductVariantSelectorProps = {
  variants: ProductVariant[]
  onVariantChange?: (variant: ProductVariant) => void
  onAddToCart?: (variant: ProductVariant) => void
  className?: string
  "data-testid"?: string
}

// Mock data for testing - remove when integrating with real data
const MOCK_VARIANTS: ProductVariant[] = [
  {
    id: "1",
    title: "250g",
    price: 25,
    inventory_quantity: 10
  },
  {
    id: "2", 
    title: "500g",
    price: 45,
    inventory_quantity: 8
  },
  {
    id: "3",
    title: "1kg",
    price: 85,
    inventory_quantity: 5
  }
]

const ProductVariantSelector = ({ 
  variants,
  onVariantChange,
  onAddToCart,
  className,
  "data-testid": dataTestId = "product-variant-selector"
}: ProductVariantSelectorProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants && variants.length > 0 ? variants[0] : null
  )

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    onVariantChange?.(variant)
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart?.(selectedVariant)
    }
  }

  if (!variants || variants.length === 0 || !selectedVariant) {
    return null
  }

  return (
    <Container 
      className={clx("w-full", className)}
      data-testid={dataTestId}
    >
      <div className="flex flex-col gap-6">
        {/* Section Title */}
        <div className="px-4">
          <h2 className="text-ui-fg-base font-bold text-xl small:text-2xl leading-7">
            Product Options
          </h2>
        </div>

        {/* Variant Options */}
        <div className="flex flex-wrap gap-3 px-4">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant)}
              disabled={variant.inventory_quantity === 0}
              className={clx(
                "flex h-11 px-4 items-center justify-center rounded-base border transition-all duration-200",
                "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ui-fg-base focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selectedVariant.id === variant.id
                  ? "border-ui-fg-base bg-ui-bg-base text-ui-fg-base font-medium"
                  : "border-ui-border-base bg-ui-bg-subtle text-ui-fg-muted hover:border-ui-fg-muted"
              )}
              aria-label={`Select ${variant.title} variant`}
              data-testid={`variant-${variant.id}`}
            >
              <span className="text-base leading-5">
                {variant.title}
              </span>
            </button>
          ))}
        </div>

        {/* Add to Cart Button */}
        <div className="px-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.inventory_quantity === 0}
            className={clx(
              "flex h-12 min-w-20 max-w-lg px-5 items-center justify-center rounded-base",
              "bg-ui-button-inverted text-ui-button-inverted-text font-bold text-lg leading-6",
              "hover:bg-ui-button-inverted-hover focus:outline-none focus:ring-2 focus:ring-ui-button-inverted focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
              "small:max-w-md"
            )}
            aria-label={`Add ${selectedVariant.title} to cart for $${selectedVariant.price}`}
            data-testid="add-to-cart-button"
          >
            <span className="text-center overflow-hidden text-ellipsis line-clamp-1">
              Add to Cart - ${selectedVariant.price}
            </span>
          </button>
        </div>
      </div>
    </Container>
  )
}

export default ProductVariantSelector
