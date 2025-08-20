import Link from 'next/link'

// Mock BBQ package data - will be replaced with Medusa product integration
interface BBQPackage {
  id: string
  title: string
  description: string
  price: number
  region: string
  slug: string
}

interface FeaturedBBQProps {
  packages?: BBQPackage[]
}

export function FeaturedBBQ({ packages = mockPackages }: FeaturedBBQProps) {
  return (
    <section className="featured-bbq" id="menu">
      <div className="featured-container">
        <div className="section-header">
          <span className="section-badge">Take-Home BBQ Packages</span>
          <h2 className="section-title">Regional American BBQ</h2>
          <p className="section-subtitle">
            Authentic regional BBQ packages available to take home after our tasting events. 
            Each package features traditional preparations from specific American BBQ regions.
          </p>
        </div>

        <div className="bbq-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bbq-card">
              <div className="bbq-image">
                <div className="bbq-badge">{pkg.region}</div>
              </div>
              <div className="bbq-content">
                <h3 className="bbq-title">{pkg.title}</h3>
                <p className="bbq-description">
                  {pkg.description}
                </p>
                <div className="bbq-footer">
                  <span className="bbq-price">${pkg.price}</span>
                  <Link href={`/event`} className="bbq-cta">
                    Pre-Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Default mock packages matching your prototype
export const mockPackages: BBQPackage[] = [
  {
    id: 'pkg_kc_burnt_ends',
    title: 'Burnt Ends Package',
    description: 'Kansas City-style burnt ends with molasses-based sauce. The "candy" of BBQ. Vacuum-sealed for your freezer.',
    price: 35,
    region: 'Kansas City',
    slug: 'burnt-ends-package'
  },
  {
    id: 'pkg_carolina_pulled_pork',
    title: 'Pulled Pork Package', 
    description: 'Eastern Carolina whole-hog pulled pork with vinegar-based sauce. Traditional low country BBQ at its finest.',
    price: 32,
    region: 'Carolina',
    slug: 'pulled-pork-package'
  },
  {
    id: 'pkg_memphis_ribs',
    title: 'Dry Rub Ribs Package',
    description: 'Memphis-style dry rub ribs - no sauce needed. The rub speaks for itself. Authentic Beale Street tradition.',
    price: 42,
    region: 'Memphis', 
    slug: 'dry-rub-ribs-package'
  }
]