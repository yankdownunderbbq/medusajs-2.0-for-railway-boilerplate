'use client'

import { useState } from 'react'

interface Package {
  id: string
  title: string
  description: string
  price: number
  region: string
  includes: string[]
}

interface PackageSelectorProps {
  package: Package
  onQuantityChange: (packageId: string, quantity: number) => void
  quantity: number
}

export function PackageSelector({ package: pkg, onQuantityChange, quantity }: PackageSelectorProps) {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  
  const dietaryOptions = [
    'Gluten Free',
    'Dairy Free', 
    'Nut Allergy',
    'Vegetarian Sides Only'
  ]

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= 10) {
      onQuantityChange(pkg.id, newQuantity)
    }
  }

  const toggleDietary = (option: string) => {
    setSelectedDietary(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  return (
    <div className="bg-bg-primary rounded-3xl overflow-hidden shadow-subtle transition-all duration-medium hover:-translate-y-1 hover:shadow-medium">
      {/* Package Header */}
      <div className="bbq-image relative">
        <div className="bbq-badge">{pkg.region}</div>
        <div className="absolute inset-0 bg-gradient-to-br from-soft-copper to-warm-copper flex items-center justify-center">
          <span className="text-2xl font-bold text-warm-white opacity-90">BBQ</span>
        </div>
      </div>

      {/* Package Content */}
      <div className="p-6">
        <h3 className="bbq-title">{pkg.title}</h3>
        <p className="bbq-description">{pkg.description}</p>
        
        {/* What's Included */}
        <div className="mb-6">
          <h4 className="font-display font-semibold text-text-primary mb-2">What&apos;s Included:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            {pkg.includes.map((item, index) => (
              <li key={index} className="flex items-center">
                <i className="fas fa-check text-warm-copper mr-2 text-xs"></i>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block font-display font-semibold text-text-primary mb-2">
            Quantity:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-10 h-10 rounded-full border-2 border-warm-copper text-warm-copper hover:bg-warm-copper hover:text-warm-white transition-colors duration-medium flex items-center justify-center font-semibold"
              disabled={quantity <= 0}
            >
              <i className="fas fa-minus"></i>
            </button>
            <span className="font-display text-xl font-bold text-text-primary min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-10 h-10 rounded-full border-2 border-warm-copper text-warm-copper hover:bg-warm-copper hover:text-warm-white transition-colors duration-medium flex items-center justify-center font-semibold"
              disabled={quantity >= 10}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>

        {/* Dietary Requirements */}
        {quantity > 0 && (
          <div className="mb-6 p-4 bg-cream rounded-lg">
            <h4 className="font-display font-semibold text-text-primary mb-3">
              Dietary Requirements:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDietary.includes(option)}
                    onChange={() => toggleDietary(option)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors duration-medium ${
                    selectedDietary.includes(option)
                      ? 'bg-warm-copper border-warm-copper'
                      : 'border-text-muted'
                  }`}>
                    {selectedDietary.includes(option) && (
                      <i className="fas fa-check text-warm-white text-xs"></i>
                    )}
                  </div>
                  <span className="text-sm text-text-secondary">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price and Total */}
        <div className="bbq-footer">
          <div className="text-left">
            <div className="bbq-price">${pkg.price}</div>
            {quantity > 1 && (
              <div className="text-sm text-text-secondary">
                Total: ${pkg.price * quantity}
              </div>
            )}
          </div>
          <div className="text-right">
            {quantity > 0 ? (
              <div className="text-warm-copper font-display font-semibold">
                <i className="fas fa-check-circle mr-1"></i>
                Added to order
              </div>
            ) : (
              <span className="text-text-muted text-sm">Select quantity</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}