const Footer = () => {
  return (
    <footer className="w-full bg-white py-10 px-5 lg:px-20">
      <div className="max-w-[960px] mx-auto">
        <div className="flex justify-center items-start gap-4 flex-wrap mb-6">
          {/* Social Media Icons */}
          <div className="flex gap-4 items-center">
            <a href="#" className="block" aria-label="TikTok">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/0106fe9f5adb7cdeacb5ea698a5002b802299679?width=48" 
                alt="TikTok" 
                className="w-12 h-12"
              />
            </a>
            <a href="#" className="block" aria-label="Instagram">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/cde9e2641a1f29ebead92af871b515c38b6b505f?width=48" 
                alt="Instagram" 
                className="w-12 h-12"
              />
            </a>
            <a href="#" className="block" aria-label="Facebook">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/ad624f863e6e7ade76cba251f064e204de5bb4b6?width=48" 
                alt="Facebook" 
                className="w-12 h-12"
              />
            </a>
            <a href="#" className="block" aria-label="YouTube">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/4341adcc53883e11ab2a1dae5fbca7d7ae4d4c98?width=48" 
                alt="YouTube" 
                className="w-12 h-12"
              />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#B5A6A3] text-base leading-6 font-['Plus_Jakarta_Sans',sans-serif]">
            © 2024 Yank Downunder BBQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
