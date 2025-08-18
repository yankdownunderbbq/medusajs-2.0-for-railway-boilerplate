"use client"

import { Container, clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import React, { useState } from "react"

type ProductImageCarouselProps = {
  images: HttpTypes.StoreProductImage[]
  className?: string
  "data-testid"?: string
}

// Extended mock data for testing scrolling - remove when integrating with real data
const MOCK_IMAGES: HttpTypes.StoreProductImage[] = [
  {
    id: "1",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/2b0c717134730bd1e778bd0f25e5077a0732f4f3?width=1346",
    alt: "Sliced BBQ Brisket - Main View"
  },
  {
    id: "2",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/8731392fae492b1bcd3a1832a5dd96ccb5ecdb5c?width=444",
    alt: "Sliced BBQ Brisket - Close Up"
  },
  {
    id: "3",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/39a8d0fa3b44ff0636849366ac58433a69e9de8e?width=444",
    alt: "Sliced BBQ Brisket - Grilled View"
  },
  {
    id: "4",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/c26939c8338748f51892c4d572b8e8905ad5fdc9?width=444",
    alt: "Sliced BBQ Brisket - Plated View"
  },
  {
    id: "5",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/8752271aae495fbcb05cc67e15d564d570453deb?width=444",
    alt: "Sliced BBQ Brisket - Cutting Board"
  },
  {
    id: "6",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/9d6a8079436c44f47d3324ef9b1193c3ac32c54e?width=1856",
    alt: "Sliced BBQ Brisket - Side Angle"
  },
  {
    id: "7",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/5641297ba1a5331bf3f2968bf639ae13f4628af3?width=320",
    alt: "Sliced BBQ Brisket - Cross Section"
  },
  {
    id: "8",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/df5ddb7f98318d909982282d56d4909022721be5?width=320",
    alt: "Sliced BBQ Brisket - Smoker View"
  },
  {
    id: "9",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/ca6d49bca475df25454665d6a081ff413b486138?width=320",
    alt: "Sliced BBQ Brisket - Seasoned"
  },
  {
    id: "10",
    url: "https://api.builder.io/api/v1/image/assets/TEMP/e1b3f3bc0fee3f3c9167958c67fc39f3c6bd6d68?width=320",
    alt: "Sliced BBQ Brisket - Final Presentation"
  }
] as HttpTypes.StoreProductImage[]

const ProductImageCarousel = ({
  images = MOCK_IMAGES,
  className,
  "data-testid": dataTestId = "product-image-carousel"
}: ProductImageCarouselProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const selectedImage = images[selectedImageIndex]

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div
      className={clx("w-full", className)}
      data-testid={dataTestId}
    >
      {/* Mobile Layout - Full Page Vertical Gallery */}
      <div className="flex flex-col small:hidden">
        {/* Vertical Gallery - All Images Displayed */}
        <div className="flex flex-col gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative w-full aspect-[4/3] bg-ui-bg-subtle rounded-large overflow-hidden"
              data-testid={`mobile-image-${index}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Product Image ${index + 1}`}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority={index <= 2}
                draggable={false}
                className="transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Horizontal Split */}
      <div className="hidden small:flex gap-6 px-4">
        {/* Main Image Display */}
        <div className="flex-grow">
          <div className="relative w-full aspect-[4/3] bg-ui-bg-subtle rounded-large overflow-hidden">
            <Image
              src={selectedImage?.url || ""}
              alt={selectedImage?.alt || "Product Image"}
              fill
              sizes="(max-width: 768px) 60vw, (max-width: 992px) 480px, 600px"
              style={{ objectFit: "cover" }}
              priority={true}
              draggable={false}
              className="transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Vertical Thumbnail Gallery for Desktop - Larger thumbnails */}
        {images.length > 1 && (
          <div className="w-64 flex-shrink-0">
            <div className="flex flex-col gap-4 h-[600px] overflow-y-auto scrollbar-hide pr-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={clx(
                    "relative w-full aspect-[4/3] flex-shrink-0 rounded-base overflow-hidden border-2 transition-all duration-200",
                    "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ui-fg-base focus:ring-offset-2",
                    selectedImageIndex === index
                      ? "border-ui-fg-base shadow-elevation-card-hover"
                      : "border-ui-border-base opacity-70 hover:opacity-100"
                  )}
                  aria-label={`View ${image.alt || `image ${index + 1}`}`}
                  data-testid={`thumbnail-${index}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Product Image ${index + 1}`}
                    fill
                    sizes="256px"
                    style={{ objectFit: "cover" }}
                    quality={50}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductImageCarousel
