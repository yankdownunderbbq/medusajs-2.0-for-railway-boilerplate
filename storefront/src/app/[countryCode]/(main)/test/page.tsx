// app/test/page.tsx

import ProductImageCarousel from "@modules/products/components/ProductImageCarousel";

// MOCK_IMAGES will be included in the index.tsx file,
// so you don't need to define it here.

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Carousel Test Page</h1>
      <ProductImageCarousel />
    </div>
  );
}