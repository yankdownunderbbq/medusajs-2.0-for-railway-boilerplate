"use client"

import { Container, clx } from "@medusajs/ui"
import React from "react"

type ProductFeature = {
  id: string
  label: string
  icon: React.ReactNode
}

type ProductFeaturesProps = {
  features?: ProductFeature[]
  className?: string
  "data-testid"?: string
}

const ProductFeatures = ({ 
  features,
  className,
  "data-testid": dataTestId = "product-features"
}: ProductFeaturesProps) => {

  if (!features || features.length === 0) {
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
            Features
          </h2>
        </div>

        {/* Features Grid */}
        <div className="px-4">
          <div className="flex flex-col small:flex-row gap-3 small:gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={clx(
                  "flex items-center gap-3 p-4 rounded-base border border-ui-border-strong bg-ui-bg-base",
                  "flex-1 min-w-0"
                )}
                data-testid={`feature-${feature.id}`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-6 h-6 text-ui-border-strong">
                  {feature.icon}
                </div>
                
                {/* Label */}
                <span className="text-ui-border-strong font-bold text-base small:text-lg leading-5">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}

// Default icons for common features
export const FeatureIcons = {
  WoodSmoked: (
    <svg 
      width="18" 
      height="21" 
      viewBox="0 0 18 21" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M14.2397 13.3756C13.8414 15.6005 12.0996 17.3419 9.87469 17.7397C9.83345 17.7463 9.79176 17.7497 9.75 17.75C9.35993 17.7499 9.03506 17.4508 9.00277 17.0621C8.97048 16.6734 9.24155 16.3248 9.62625 16.2603C11.1797 15.9988 12.4978 14.6806 12.7612 13.1244C12.8306 12.7159 13.218 12.4409 13.6266 12.5103C14.0351 12.5797 14.31 12.9671 14.2406 13.3756H14.2397ZM17.25 12.5C17.25 17.0563 13.5563 20.75 9 20.75C4.44365 20.75 0.75 17.0563 0.75 12.5C0.75 9.8825 1.78125 7.20594 3.81187 4.54531C3.94189 4.37491 4.1386 4.26827 4.35235 4.25232C4.5661 4.23638 4.77645 4.31265 4.93031 4.46187L7.19156 6.65656L9.25406 0.993125C9.33768 0.763899 9.52759 0.58968 9.76315 0.526079C9.99872 0.462477 10.2505 0.517446 10.4381 0.673437C12.4884 2.375 17.25 6.92656 17.25 12.5ZM15.75 12.5C15.75 8.17906 12.3947 4.445 10.2928 2.53156L8.205 8.25688C8.11794 8.4958 7.91574 8.67433 7.66787 8.73114C7.42 8.78795 7.16024 8.71529 6.97781 8.53813L4.50562 6.14C3.00844 8.30094 2.25 10.4375 2.25 12.5C2.25 16.2279 5.27208 19.25 9 19.25C12.7279 19.25 15.75 16.2279 15.75 12.5Z" 
        fill="currentColor"
      />
    </svg>
  ),
  
  Clock: (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.7443 4.61758 15.3824 0.255684 10 0.25ZM10 18.25C5.44365 18.25 1.75 14.5563 1.75 10C1.75 5.44365 5.44365 1.75 10 1.75C14.5563 1.75 18.25 5.44365 18.25 10C18.2448 14.5542 14.5542 18.2448 10 18.25ZM16 10C16 10.4142 15.6642 10.75 15.25 10.75H10C9.58579 10.75 9.25 10.4142 9.25 10V4.75C9.25 4.33579 9.58579 4 10 4C10.4142 4 10.75 4.33579 10.75 4.75V9.25H15.25C15.6642 9.25 16 9.58579 16 10Z" 
        fill="currentColor"
      />
    </svg>
  ),
  
  Leaf: (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 18 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M17.9484 0.756562C17.9263 0.376768 17.6232 0.0737419 17.2434 0.0515625C10.1062 -0.3675 4.38938 1.78125 1.95188 5.8125C1.10697 7.19148 0.690616 8.79032 0.755625 10.4062C0.809062 11.8988 1.24406 13.4062 2.04844 14.8922L0.219375 16.7203C0.0298009 16.9099 -0.0442362 17.1862 0.0251527 17.4452C0.0945415 17.7041 0.296815 17.9064 0.555778 17.9758C0.814741 18.0452 1.09105 17.9711 1.28062 17.7816L3.10875 15.9525C4.59375 16.7559 6.10219 17.1909 7.59375 17.2444C7.69812 17.2481 7.80219 17.25 7.90594 17.25C9.41695 17.254 10.8993 16.8379 12.1875 16.0481C16.2188 13.6106 18.3684 7.89469 17.9484 0.756562ZM11.4141 14.7656C9.28125 16.0575 6.75656 16.0781 4.2225 14.8378L12.5316 6.52969C12.8246 6.23663 12.8246 5.76149 12.5316 5.46844C12.2385 5.17538 11.7634 5.17538 11.4703 5.46844L3.16219 13.7812C1.92562 11.25 1.94344 8.71875 3.23438 6.58969C5.30531 3.17062 10.2281 1.29844 16.4822 1.52156C16.7062 7.77094 14.8331 12.6947 11.4141 14.7656Z" 
        fill="currentColor"
      />
    </svg>
  )
}

export default ProductFeatures
