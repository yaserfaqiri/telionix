import LegacyApp from "./App.js";
import HomePage from "./pages/HomePage.js";
import StorePage from "./pages/StorePage.js";
import ShowroomPage from "./pages/ShowroomPage.js";
import AboutPage from "./pages/AboutPage.js";
import SupportPage from "./pages/SupportPage.js";
import ProductDetailPage from "./pages/ProductDetailPage.js";
import ProductsPage from "./pages/ProductsPage.js";
import SearchPage from "./pages/SearchPage.js";
const siteLogo = new URL("../telionix-logo.png", import.meta.url).href;

export default {
  extends: LegacyApp,
  data() {
    return {
      siteLogo,
    };
  },
  components: {
    HomePage,
    StorePage,
    ShowroomPage,
    AboutPage,
    SupportPage,
    ProductDetailPage,
    ProductsPage,
    SearchPage,
  },
  template: `
    <div class="page-shell">
      <a class="floating-whatsapp" href="#/" @click.prevent="goToRoute('home')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11.5a8 8 0 0 1-11.8 7l-3.2.8.9-3.1A8 8 0 1 1 20 11.5Z"></path>
          <path d="M9.2 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.2-.8.8-.8 1.9s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.4 1.9.8 2.3.7 2.8.6.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.4-.2-.9-.5-.5-.2-1-.5-1.2-.6-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.8-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.5-1.1-1.2-1.2-1.4-.1-.2 0-.3.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.4-1-.7-1.6Z"></path>
        </svg>
      </a>
      <button v-if="showScrollTop" class="floating-scroll-top" type="button" aria-label="Back to top" @click="scrollToTop">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 18V6"></path>
          <path d="M6.5 11.5L12 6l5.5 5.5"></path>
        </svg>
      </button>

      <header class="site-header">
        <div class="header-desktop shell">
          <div class="header-left">
            <a class="lg-logo" href="#/" @click.prevent="goToRoute('home')">
              <img :src="siteLogo" alt="Telionix" />
            </a>
          </div>

          <div class="header-right">
            <div class="header-topline">
              <div class="brand-wordmarks">
                <a href="#/" @click.prevent="goToRoute('home')">Telionix China</a>
              </div>

              <a class="business-pill" href="#/showroom" @click.prevent="goToRoute('showroom')">BRAND SHOP</a>
            </div>

            <div class="header-bottomline">
              <nav class="primary-links">
                <a href="#/" @click.prevent="goToRoute('home')">HOME</a>
                <span class="primary-divider"></span>
                <div
                  class="primary-item has-panel"
                  @mouseenter="openDesktopDropdown('products')"
                  @mouseleave="scheduleCloseDesktopDropdown"
                >
                  <a href="#/product" @click.prevent="goToRoute('product')">PRODUCTS</a>
                  <div
                    class="products-dropdown"
                    :class="{ open: activeDesktopDropdown === 'products' }"
                    @mouseenter="openDesktopDropdown('products')"
                    @mouseleave="scheduleCloseDesktopDropdown"
                  >
                    <div class="products-dropdown-inner shell">
                      <a
                        v-for="item in siteCategories"
                        :key="item.slug"
                        href="#/"
                        class="dropdown-category-card"
                        @click.prevent="goToRoute('product', { category: item.slug })"
                      >
                        {{ item.label }}
                      </a>
                    </div>
                  </div>
                </div>
                <span class="primary-divider"></span>
                <a href="#/store" @click.prevent="goToRoute('store')">Store</a>
                <span class="primary-divider"></span>
                <a href="#/about" @click.prevent="goToRoute('about')">About Us</a>
                <span class="primary-divider"></span>
                <a href="#/support" @click.prevent="goToRoute('support')">SUPPORT</a>
              </nav>

              <div class="header-icons">
                <a href="#/" aria-label="Language" @click.prevent="goToRoute('home')">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M3 12h18"></path>
                    <path d="M12 3a15 15 0 0 1 0 18"></path>
                    <path d="M12 3a15 15 0 0 0 0 18"></path>
                  </svg>
                </a>
                <a href="#/" aria-label="My LG" @click.prevent="goToRoute('home')">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
                  </svg>
                </a>
                <div class="wishlist-shell" :class="{ open: wishlistOpen }">
                  <button
                    type="button"
                    class="wishlist-button header-wishlist-button"
                    :class="{ active: wishlistCount > 0 }"
                    aria-label="Open wishlist"
                    @click.stop="toggleWishlistDropdown"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 6.5-6.5L12 7l.6-.6A4.6 4.6 0 1 1 19.1 13L12 20.2Z"></path>
                    </svg>
                    <span v-if="wishlistCount" class="wishlist-badge">{{ wishlistCount }}</span>
                  </button>

                  <div v-if="wishlistOpen" class="wishlist-dropdown">
                    <div class="wishlist-dropdown-head">
                      <strong>Wishlist</strong>
                      <span>{{ wishlistCount }} item{{ wishlistCount === 1 ? '' : 's' }}</span>
                    </div>

                    <div v-if="wishlistProducts.length" class="wishlist-dropdown-list">
                      <div
                        v-for="product in wishlistProducts"
                        :key="product.sku + '-wishlist'"
                        class="wishlist-item"
                      >
                        <button
                          type="button"
                          class="wishlist-item-main"
                          @click="handleWishlistProductClick(product)"
                        >
                          <img :src="product.image" :alt="product.title" />
                          <div class="wishlist-item-copy">
                            <strong>{{ product.title }}</strong>
                            <span>{{ product.sku }}</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          class="wishlist-item-delete"
                          aria-label="Remove from wishlist"
                          @click.stop="removeFromWishlist(product)"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 7h14"></path>
                            <path d="M9 7V5h6v2"></path>
                            <path d="M8 7l.7 11h6.6L16 7"></path>
                            <path d="M10 10.5v4.5"></path>
                            <path d="M14 10.5v4.5"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p v-else class="wishlist-empty">No products saved yet.</p>
                  </div>
                </div>
                <button type="button" class="header-search-button" aria-label="Search" @click="openSearchPage(searchQuery)">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="M16 16l4.5 4.5"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="header-mobile shell">
          <div class="mobile-toolbar">
            <div class="mobile-toolbar-left">
              <button class="mobile-icon-btn" type="button" aria-label="Open menu" @click="openMobileMenu">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 7h14"></path>
                  <path d="M5 12h14"></path>
                  <path d="M5 17h14"></path>
                </svg>
              </button>
              <button class="mobile-icon-btn" type="button" aria-label="Open search" @click="openMobileSearch">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5"></circle>
                  <path d="M16 16l4.5 4.5"></path>
                </svg>
              </button>
            </div>

            <a class="mobile-center-logo" href="#/" @click.prevent="goToRoute('home')">
              <img :src="siteLogo" alt="Telionix" />
            </a>

            <div class="mobile-toolbar-right">
              <div class="wishlist-shell" :class="{ open: wishlistOpen }">
                <button
                  type="button"
                  class="mobile-icon-btn wishlist-button"
                  :class="{ active: wishlistCount > 0 }"
                  aria-label="Open wishlist"
                  @click.stop="toggleWishlistDropdown"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 6.5-6.5L12 7l.6-.6A4.6 4.6 0 1 1 19.1 13L12 20.2Z"></path>
                  </svg>
                  <span v-if="wishlistCount" class="wishlist-badge">{{ wishlistCount }}</span>
                </button>

                <div v-if="wishlistOpen" class="wishlist-dropdown mobile-wishlist-dropdown">
                  <div class="wishlist-dropdown-head">
                    <strong>Wishlist</strong>
                    <span>{{ wishlistCount }} item{{ wishlistCount === 1 ? '' : 's' }}</span>
                  </div>

                  <div v-if="wishlistProducts.length" class="wishlist-dropdown-list">
                    <div
                      v-for="product in wishlistProducts"
                      :key="product.sku + '-mobile-wishlist'"
                      class="wishlist-item"
                    >
                      <button
                        type="button"
                        class="wishlist-item-main"
                        @click="handleWishlistProductClick(product)"
                      >
                        <img :src="product.image" :alt="product.title" />
                        <div class="wishlist-item-copy">
                          <strong>{{ product.title }}</strong>
                          <span>{{ product.sku }}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        class="wishlist-item-delete"
                        aria-label="Remove from wishlist"
                        @click.stop="removeFromWishlist(product)"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 7h14"></path>
                          <path d="M9 7V5h6v2"></path>
                          <path d="M8 7l.7 11h6.6L16 7"></path>
                          <path d="M10 10.5v4.5"></path>
                          <path d="M14 10.5v4.5"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p v-else class="wishlist-empty">No products saved yet.</p>
                </div>
              </div>

            <a class="mobile-icon-btn" href="#/" aria-label="My LG" @click.prevent="goToRoute('home')">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
                </svg>
              </a>
            </div>
          </div>

          <div class="mobile-brand-strip">
            <a href="#/" @click.prevent="goToRoute('home')">Telionix China</a>
          </div>

          <div v-if="mobileSearchOpen" class="mobile-overlay" @click.self="closeMobilePanels">
            <div class="mobile-search-panel">
              <div class="mobile-search-head">
                <div class="mobile-search-input">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="M16 16l4.5 4.5"></path>
                  </svg>
                  <input
                    v-model="mobileSearchQuery"
                    type="text"
                    placeholder=""
                    aria-label="Search products"
                  />
                </div>
                <button type="button" class="mobile-close-text" @click="closeMobilePanels">Close</button>
              </div>

              <div class="mobile-search-body">
                <p>Try Searching</p>
                <div class="mobile-search-tags">
                  <button
                    v-for="tag in mobileSearchSuggestions"
                    :key="tag"
                    type="button"
                    class="mobile-search-tag"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mobileMenuOpen" class="mobile-overlay" @click.self="closeMobilePanels">
            <div class="mobile-menu-panel">
              <div class="mobile-menu-topbar">
                <button class="mobile-icon-btn" type="button" aria-label="Close menu" @click="closeMobilePanels">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12"></path>
                    <path d="M18 6L6 18"></path>
                  </svg>
                </button>
                <button class="mobile-icon-btn" type="button" aria-label="Open search" @click="openMobileSearch">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="M16 16l4.5 4.5"></path>
                  </svg>
                </button>
                <a class="mobile-menu-logo" href="#/" @click.prevent="goToRoute('home')">
                  <img :src="siteLogo" alt="Telionix" />
                </a>
                <a class="mobile-icon-btn" href="#/" aria-label="My LG" @click.prevent="goToRoute('home')">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
                  </svg>
                </a>
              </div>

              <div class="mobile-menu-brands">
                <a href="#/" @click.prevent="goToRoute('home')">Telionix China</a>
              </div>

              <nav class="mobile-menu-links">
                <a
                  v-for="item in mobileMenuCategories"
                  :key="item.label"
                  :href="item.link"
                  class="mobile-menu-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{{ item.label }}</span>
                  <span class="mobile-menu-arrow">&rsaquo;</span>
                </a>
                <a href="#/support" class="mobile-menu-link" @click.prevent="goToRoute('support'); closeMobilePanels()">
                  <span>SUPPORT</span>
                  <span class="mobile-menu-arrow">&rsaquo;</span>
                </a>
              </nav>

              <div class="mobile-menu-actions">
                <a
                  v-for="link in mobileQuickLinks"
                  :key="link.label"
                  :href="link.href"
                  class="mobile-menu-action"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{{ link.label }}</span>
                  <span v-if="link.label === 'Languages'" class="mobile-menu-arrow">&rsaquo;</span>
                </a>
              </div>

              <div class="mobile-menu-footer">
                <strong>Seamless Integration</strong>
                <p>Connect to Google Assistant, Amazon Alexa and over 150 connected devices.</p>
              </div>
            </div>
          </div>

          <nav class="category-nav" :class="{ open: mobileMenuOpen }">
            <a
              v-for="item in menuItems"
              :key="item.label"
              :href="item.link"
              class="nav-item"
            >
              <span>{{ item.label }}</span>
              <div class="mega-panel">
                <strong>{{ item.label }}</strong>
                <ul>
                  <li v-for="child in item.children" :key="child">{{ child }}</li>
                </ul>
              </div>
            </a>
          </nav>
        </div>
      </header>

      <HomePage
        v-if="isHomeRoute"
        :hero-slides="heroSlides"
        :active-hero="activeHero"
        :prev-hero="prevHero"
        :next-hero="nextHero"
        :set-hero="setHero"
        :start-hero-timer="startHeroTimer"
        :headers-loading="headersLoading"
        :content-load-error="contentLoadError"
        :strip-banner="stripBanner"
        :product-tabs="productTabs"
        :active-tab="activeTab"
        :set-active-tab="setActiveTab"
        :current-products="currentProducts"
        :scroll-product-tabs="scrollProductTabs"
        :scroll-products="scrollProducts"
        :go-to-product="goToProduct"
        :go-to-route="goToRoute"
        :get-product-tags="getProductTags"
        :get-rating-stars="getRatingStars"
        :toggle-wishlist="toggleWishlist"
        :is-wishlisted="isWishlisted"
        :promo-cards="promoCards"
        :mosaic-cards="mosaicCards"
        :home-category-items="homeCategoryItems"
        :scroll-home-categories="scrollHomeCategories"
        :socials="socials"
        :service-cards="serviceCards"
      />

      <StorePage
        v-else-if="isStoreRoute"
        :store-category-filters="storeCategoryFilters"
        :active-store-filter="activeStoreFilter"
        :set-active-store-filter="setActiveStoreFilter"
        :store-products="storeProducts"
        :products-loading="productsLoading"
        :product-load-error="productLoadError"
        :go-to-product-detail="goToProductDetail"
        :toggle-wishlist="toggleWishlist"
        :is-wishlisted="isWishlisted"
        :get-product-tags="getProductTags"
      />

      <ShowroomPage
        v-else-if="isShowroomRoute"
        :go-to-route="goToRoute"
        :scroll-to-page-section="scrollToPageSection"
        :showroom-tabs="showroomTabs"
        :showroom-hero="showroomHero"
        :showroom-lead-feature="showroomLeadFeature"
        :showroom-secondary-hero="showroomSecondaryHero"
        :showroom-experience-cards="showroomExperienceCards"
        :showroom-promise-cards="showroomPromiseCards"
        :showroom-finder-countries="showroomFinderCountries"
        :showroom-locations="showroomLocations"
        :service-cards="serviceCards"
      />

      <AboutPage
        v-else-if="isAboutRoute"
        :go-to-route="goToRoute"
        :about-hero="aboutHero"
        :about-stats="aboutStats"
        :about-values="aboutValues"
        :about-focus-cards="aboutFocusCards"
        :active-about-focus="activeAboutFocus"
        :set-active-about-focus="setActiveAboutFocus"
        :about-closing="aboutClosing"
      />

      <SupportPage
        v-else-if="isSupportRoute"
        :go-to-route="goToRoute"
        :support-query="supportQuery"
        :set-support-query="setSupportQuery"
        :support-hero="supportHero"
        :support-hero-image="currentSupportHeroImage"
        :support-loading="supportLoading"
        :support-load-error="supportLoadError"
        :support-notice="supportNotice"
        :support-matched-product="supportMatchedProduct"
        :support-related-products="supportRelatedProducts"
        :support-solutions="supportSolutions"
        :support-help-cards="supportHelpCards"
        :support-promo-cards="supportPromoCards"
        :support-contact-methods="supportContactMethods"
        :go-to-product-detail="goToProductDetail"
      />

      <SearchPage
        v-else-if="isSearchRoute"
        :search-query="searchQuery"
        :set-search-query="setSearchQuery"
        :submit-search="submitSearch"
        :clear-search-query="clearSearchQuery"
        :search-category-suggestions="searchCategorySuggestions"
        :search-product-suggestions="searchProductSuggestions"
        :filtered-search-products="filteredSearchProducts"
        :search-result-category-counts="searchResultCategoryCounts"
        :active-search-category="searchCategoryFilter"
        :set-search-category="setSearchCategory"
        :open-catalog-category="openCatalogCategory"
        :search-products-count="searchProductsCount"
        :search-support-count="searchSupportCount"
        :go-to-product-detail="goToProductDetail"
        :get-product-tags="getProductTags"
        :get-rating-stars="getRatingStars"
      />

      <ProductDetailPage
        v-else-if="isProductRoute && selectedProduct"
        :go-to-route="goToRoute"
        :selected-product="selectedProduct"
        :selected-product-image="selectedProductImage"
        :selected-product-gallery="selectedProductGallery"
        :visible-product-gallery="visibleProductGallery"
        :active-product-media="activeProductMedia"
        :prev-product-media="prevProductMedia"
        :next-product-media="nextProductMedia"
        :select-product-media="selectProductMedia"
        :get-product-tags="getProductTags"
        :get-rating-stars="getRatingStars"
        :visible-product-features="visibleProductFeatures"
        :detail-features-expanded="detailFeaturesExpanded"
        :toggle-detail-features="toggleDetailFeatures"
        :toggle-wishlist="toggleWishlist"
        :is-wishlisted="isWishlisted"
      />
      <main v-else-if="isProductRoute" class="shell">
        <section class="empty-state product-missing-state">
          <div class="empty-icon">{{ productsLoading ? "..." : "!" }}</div>
          <h3>{{ productsLoading ? "Loading product..." : "Product not found." }}</h3>
          <p v-if="productLoadError">{{ productLoadError }}</p>
          <button class="btn-secondary" type="button" @click="goToRoute('product')">Back to Products</button>
        </section>
      </main>

      <ProductsPage
        v-else-if="isTvRoute"
        :hero-slides="heroSlides"
        :active-hero="activeHero"
        :prev-hero="prevHero"
        :next-hero="nextHero"
        :set-hero="setHero"
        :start-hero-timer="startHeroTimer"
        :headers-loading="headersLoading"
        :content-load-error="contentLoadError"
        :tv-page-categories="productSliderItems"
        :scroll-tv-categories="scrollTvCategories"
        :tv-filter-groups="tvFilterGroups"
        :tv-sort-by="tvSortBy"
        :set-tv-sort-by="setTvSortBy"
        :tv-result-count="tvResultCountValue"
        :sorted-tv-page-products="sortedTvPageProducts"
        :get-product-tags="getProductTags"
        :get-rating-stars="getRatingStars"
        :go-to-product-detail="goToProductDetail"
        :toggle-wishlist="toggleWishlist"
        :is-wishlisted="isWishlisted"
      />

      <footer class="site-footer">
        <div class="shell footer-top">
          <div class="footer-brand">
            <img :src="siteLogo" alt="Telionix" />
            <p>Gulf, English</p>
            <span>Afghanistan, Armenia, Azerbaijan, Bahrain, Georgia, Kuwait, Oman, Pakistan, Qatar, U.A.E, Yemen</span>
          </div>
          <div class="footer-columns">
            <div v-for="column in footerDisplayColumns" :key="column.title" class="footer-column">
              <h3 v-if="column.kind === 'products'">{{ column.title }}</h3>
              <h3 v-else>
                <a href="#/" @click.prevent="goToRoute(column.links[0].route)">{{ column.title }}</a>
              </h3>
              <a
                v-for="link in column.links"
                :key="link.label"
                href="#/"
                @click.prevent="column.kind === 'products' ? goToRoute('product', { category: link.slug }) : goToRoute(link.route)"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
        <div class="shell footer-bottom">
          <div class="legal-links">
            <a
              v-for="link in legalLinks"
              :key="link.label"
              href="#/"
              @click.prevent="goToRoute(link.route)"
            >{{ link.label }}</a>
          </div>
          <p class="copyright">Copyright &copy; 2026 Telionix Electronics. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  `,
};
