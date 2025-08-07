"use client"

import { useState } from "react"

const CateringQuote = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    guestCount: "",
    location: "",
    additionalDetails: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [error, setError] = useState("")

  const guestOptions = [
    "Less than 20 people",
    "20 to 40 people",
    "40 to 60 people",
    "60 to 80 people",
    "80 to 100 people",
    "More than 100 people"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  // Australian phone number validation function
  const isValidAustralianPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+61|0)[2-478]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Basic validation
    if (!formData.name || !formData.phone || !formData.email || !formData.eventDate || !formData.guestCount || !formData.location) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address (e.g., example@domain.com)")
      setIsSubmitting(false)
      return
    }

    // Phone validation
    if (!isValidAustralianPhone(formData.phone)) {
      setError("Please enter a valid Australian phone number (e.g., 0412345678 or +61412345678)")
      setIsSubmitting(false)
      return
    }

    try {
      // Debug: Log the form data being sent
      console.log('Submitting form data:', formData)

      const response = await fetch('https://yankdownunderbbq-backend-production.up.railway.app/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowThankYou(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      setError('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showThankYou) {
    return (
      <section className="w-full bg-white py-12 px-4 sm:px-8 lg:px-40">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center py-16">
            <h2 className="text-[#192D61] text-3xl font-bold mb-4 font-sans">
              Thank You!
            </h2>
            <p className="text-[#192D61] text-lg font-sans">
              Thanks for reaching out! Someone will be in touch within 24 hours.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-8 lg:px-40">
      <div className="max-w-[960px] mx-auto">
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-12 px-4">
          <div className="flex-1 min-w-0 lg:min-w-[400px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/863ecf5f8470ca9e81f21a744f4ecd5acb8580bd?width=876"
              alt="BBQ catering spread"
              className="w-full h-[240px] sm:h-[300px] lg:h-[340px] object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0 lg:min-w-[400px] flex flex-col justify-center gap-6 lg:gap-8">
            <div className="space-y-2">
              <h1 className="text-[#192D61] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight lg:leading-[60px] font-sans tracking-tight lg:tracking-[-2px]">
                Feed a Crowd with Authentic American BBQ
              </h1>
              <p className="text-[#192D61] text-sm sm:text-base leading-6 font-sans">
                We cater for birthdays, corporate events, and church gatherings with slow-smoked meats and crowd-pleasing sides.
              </p>
            </div>
            <button className="bg-[#636CBE] text-white px-5 py-3 rounded-lg font-bold text-base uppercase font-sans w-fit transition-colors duration-200 hover:bg-[#5358a8]">
              DOWNLOAD MENU
            </button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-8 px-4">
          <h2 className="text-[#192D61] text-xl sm:text-2xl font-bold mb-6 font-sans">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-[#878ECD] bg-white">
              <div className="w-6 h-6 flex-shrink-0">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="#878ECD" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.97 5.20156L10.72 0.6875C10.2719 0.439919 9.72807 0.439919 9.28 0.6875L1.03 5.20344C0.550138 5.46599 0.251242 5.96894 0.25 6.51594V15.4822C0.251242 16.0292 0.550138 16.5321 1.03 16.7947L9.28 21.3106C9.72807 21.5582 10.2719 21.5582 10.72 21.3106L18.97 16.7947C19.4499 16.5321 19.7488 16.0292 19.75 15.4822V6.51687C19.7498 5.96887 19.4507 5.4646 18.97 5.20156V5.20156ZM10 2L17.5319 6.125L14.7409 7.65312L7.20813 3.52812L10 2ZM10 10.25L2.46812 6.125L5.64625 4.385L13.1781 8.51L10 10.25ZM1.75 7.4375L9.25 11.5419V19.5847L1.75 15.4831V7.4375ZM18.25 15.4794V15.4794L10.75 19.5847V11.5456L13.75 9.90406V13.25C13.75 13.6642 14.0858 14 14.5 14C14.9142 14 15.25 13.6642 15.25 13.25V9.08281L18.25 7.4375V15.4784V15.4794Z" fill="#878ECD"/>
                </svg>
              </div>
              <span className="text-[#878ECD] font-bold text-sm sm:text-base font-sans leading-tight">
                Flexible packages for any size group
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-[#878ECD] bg-white">
              <div className="w-6 h-6 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#878ECD" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.9484 0.756562C17.9263 0.376768 17.6232 0.073742 17.2434 0.0515625C10.1062 -0.3675 4.38938 1.78125 1.95188 5.8125C1.10697 7.19148 0.690616 8.79032 0.755625 10.4062C0.809063 11.8987 1.24406 13.4062 2.04844 14.8922L0.219375 16.7203C0.0298008 16.9099 -0.0442362 17.1862 0.0251527 17.4452C0.0945416 17.7041 0.296815 17.9064 0.555778 17.9758C0.814741 18.0452 1.09105 17.9711 1.28062 17.7816L3.10875 15.9525C4.59375 16.7559 6.10219 17.1909 7.59375 17.2444C7.69812 17.2481 7.80219 17.25 7.90594 17.25C9.41695 17.254 10.8993 16.8379 12.1875 16.0481C16.2188 13.6106 18.3684 7.89469 17.9484 0.756562V0.756562ZM11.4141 14.7656C9.28125 16.0575 6.75656 16.0781 4.2225 14.8378L12.5316 6.52969C12.8246 6.23663 12.8246 5.76149 12.5316 5.46844C12.2385 5.17538 11.7634 5.17538 11.4703 5.46844L3.16219 13.7812C1.92563 11.25 1.94344 8.71875 3.23438 6.58969C5.30531 3.17062 10.2281 1.29844 16.4822 1.52156C16.7062 7.77094 14.8331 12.6947 11.4141 14.7656V14.7656Z" fill="#878ECD"/>
                </svg>
              </div>
              <span className="text-[#878ECD] font-bold text-sm sm:text-base font-sans leading-tight">
                Locally sourced ingredients, cooked low and slow
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-[#878ECD] bg-white">
              <div className="w-6 h-6 flex-shrink-0">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="#878ECD" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M23.1956 5.96875L21.8831 2.6875C21.6553 2.11944 21.1039 1.74789 20.4919 1.75H17.25V1C17.25 0.585786 16.9142 0.25 16.5 0.25H2.25C1.42157 0.25 0.75 0.921573 0.75 1.75V12.25C0.75 13.0784 1.42157 13.75 2.25 13.75H3.84375C4.18363 15.0774 5.37974 16.0059 6.75 16.0059C8.12026 16.0059 9.31637 15.0774 9.65625 13.75H14.3438C14.6836 15.0774 15.8797 16.0059 17.25 16.0059C18.6203 16.0059 19.8164 15.0774 20.1562 13.75H21.75C22.5784 13.75 23.25 13.0784 23.25 12.25V6.25C23.2503 6.15361 23.2318 6.0581 23.1956 5.96875V5.96875ZM17.25 3.25H20.4919L21.3919 5.5H17.25V3.25ZM2.25 1.75H15.75V7.75H2.25V1.75ZM6.75 14.5C5.92157 14.5 5.25 13.8284 5.25 13C5.25 12.1716 5.92157 11.5 6.75 11.5C7.57843 11.5 8.25 12.1716 8.25 13C8.25 13.8284 7.57843 14.5 6.75 14.5V14.5ZM14.3438 12.25H9.65625C9.31637 10.9226 8.12026 9.99412 6.75 9.99412C5.37974 9.99412 4.18363 10.9226 3.84375 12.25H2.25V9.25H15.75V10.4041C15.0534 10.8067 14.547 11.4715 14.3438 12.25V12.25ZM17.25 14.5C16.4216 14.5 15.75 13.8284 15.75 13C15.75 12.1716 16.4216 11.5 17.25 11.5C18.0784 11.5 18.75 12.1716 18.75 13C18.75 13.8284 18.0784 14.5 17.25 14.5V14.5ZM21.75 12.25H20.1562C19.8124 10.9261 18.6179 10.0013 17.25 10V7H21.75V12.25Z" fill="#878ECD"/>
                </svg>
              </div>
              <span className="text-[#878ECD] font-bold text-sm sm:text-base font-sans leading-tight">
                On-site service or drop-off available
              </span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-4">
          <h2 className="text-[#192D61] text-xl sm:text-2xl font-bold mb-6 font-sans">
            Request a Catering Quote
          </h2>
          
          <form onSubmit={handleSubmit} className="max-w-[480px] space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-[#192D61] text-base font-sans">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] placeholder-[#192D61]/60"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-[#192D61] text-base font-sans">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 0412345678"
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] placeholder-[#192D61]/60"
                required
              />
              <p className="text-[#192D61] text-sm font-sans">
                We'll call to confirm details
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#192D61] text-base font-sans">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., john@example.com"
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] placeholder-[#192D61]/60"
                required
              />
            </div>

            {/* Event Date Field */}
            <div className="space-y-2">
              <label htmlFor="eventDate" className="block text-[#192D61] text-base font-sans">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE]"
                required
              />
            </div>

            {/* Guest Count Field */}
            <div className="space-y-2">
              <label htmlFor="guestCount" className="block text-[#192D61] text-base font-sans">
                How many people are you feeding?
              </label>
              <select
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] appearance-none"
                required
              >
                <option value="">Select guest count</option>
                {guestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-[#192D61] text-base font-sans">
                Event Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] placeholder-[#192D61]/60"
                required
              />
              <p className="text-[#192D61] text-sm font-sans">
                Just the suburb or venue name is fine.
              </p>
            </div>

            {/* Additional Details Field */}
            <div className="space-y-2">
              <label htmlFor="additionalDetails" className="block text-[#192D61] text-base font-sans">
                Anything else we should know?
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                rows={6}
                className="w-full min-h-[144px] px-4 py-4 rounded-lg bg-[#DDE7F2] border-0 text-[#192D61] font-sans focus:outline-none focus:ring-2 focus:ring-[#636CBE] resize-none placeholder-[#192D61]/60"
                placeholder="Let us know about any special requirements, dietary restrictions, preferred meats, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#636CBE] text-white px-5 py-3 rounded-lg font-bold text-base uppercase font-sans disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-[#5358a8] focus:outline-none focus:ring-2 focus:ring-[#636CBE] focus:ring-offset-2"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CateringQuote
