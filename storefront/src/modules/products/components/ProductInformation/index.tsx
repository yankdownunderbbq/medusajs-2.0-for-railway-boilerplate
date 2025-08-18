"use client"

import { Container, clx } from "@medusajs/ui"
import React, { useState } from "react"

type InformationTab = {
  id: string
  title: string
  content: string
}

type ProductInformationProps = {
  tabs?: InformationTab[]
  className?: string
  "data-testid"?: string
}

const ProductInformation = ({ 
  tabs = [],
  className,
  "data-testid": dataTestId = "product-information"
}: ProductInformationProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "")
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  const toggleAccordion = (tabId: string) => {
    const newOpenAccordions = new Set(openAccordions)
    if (newOpenAccordions.has(tabId)) {
      newOpenAccordions.delete(tabId)
    } else {
      newOpenAccordions.add(tabId)
    }
    setOpenAccordions(newOpenAccordions)
  }

  if (!tabs || tabs.length === 0) {
    return null
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)

  return (
    <Container 
      className={clx("w-full", className)}
      data-testid={dataTestId}
    >
      {/* Desktop Layout - Tabs */}
      <div className="hidden small:block">
        <div className="flex flex-col pb-3">
          {/* Tab Navigation */}
          <div className="flex px-4 border-b border-ui-border-base">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={clx(
                  "flex flex-col items-center justify-center px-0 py-4 border-b-3 transition-all duration-200",
                  "mr-8 focus:outline-none hover:opacity-80",
                  activeTab === tab.id
                    ? "border-ui-border-interactive text-ui-fg-base font-bold"
                    : "border-transparent text-ui-fg-muted font-bold hover:text-ui-fg-base"
                )}
                data-testid={`tab-${tab.id}`}
              >
                <span className="text-base leading-5 whitespace-nowrap">
                  {tab.title}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-3 px-4">
            {activeTabContent && (
              <div
                className="text-ui-fg-base text-lg leading-6 whitespace-pre-line"
                data-testid={`tab-content-${activeTabContent.id}`}
              >
                {activeTabContent.content}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Accordion */}
      <div className="block small:hidden">
        <div className="flex flex-col">
          {tabs.map((tab, index) => {
            const isOpen = openAccordions.has(tab.id)
            return (
              <div
                key={tab.id}
                className={clx(
                  "border-b border-ui-border-base",
                  index === 0 && "border-t"
                )}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(tab.id)}
                  className={clx(
                    "w-full flex items-center justify-between px-4 py-4",
                    "text-left focus:outline-none hover:bg-ui-bg-subtle transition-colors duration-200"
                  )}
                  aria-expanded={isOpen}
                  data-testid={`accordion-header-${tab.id}`}
                >
                  <span className="text-ui-fg-base font-bold text-base leading-5">
                    {tab.title}
                  </span>
                  <svg
                    className={clx(
                      "w-5 h-5 text-ui-fg-muted transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Accordion Content */}
                <div
                  className={clx(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                  data-testid={`accordion-content-${tab.id}`}
                >
                  <div className="px-4 pb-4 text-ui-fg-base text-base leading-6 whitespace-pre-line">
                    {tab.content}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}

export default ProductInformation
