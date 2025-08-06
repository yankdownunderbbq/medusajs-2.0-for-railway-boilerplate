import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="relative top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 border-ui-border-base flex">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular max-w-[1440px] mx-auto px-6">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Ff90682fb5c0d4e97bbda253b3f43cb90%2F89cc7af302b341988a3d661ca3bced8c"
              alt="Logo"
              className="object-contain object-center w-full ml-5 min-h-[92px] min-w-[74px] max-w-[74px] aspect-[0.43] md:mx-auto"
            />
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
