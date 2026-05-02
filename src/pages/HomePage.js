export default {
  props: [
    "heroSlides",
    "activeHero",
    "prevHero",
    "nextHero",
    "setHero",
    "startHeroTimer",
    "headersLoading",
    "contentLoadError",
    "stripBanner",
    "productTabs",
    "activeTab",
    "setActiveTab",
    "currentProducts",
    "scrollProductTabs",
    "scrollProducts",
    "goToProduct",
    "goToRoute",
    "getProductTags",
    "getRatingStars",
    "toggleWishlist",
    "isWishlisted",
    "promoCards",
    "mosaicCards",
    "homeCategoryItems",
    "scrollHomeCategories",
    "socials",
    "serviceCards",
  ],
  template: `
    <main>
      <section v-if="heroSlides.length || headersLoading || contentLoadError" class="hero shell">
        <div class="hero-stage">
          <article
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            class="hero-slide"
            :class="[{ active: index === activeHero }, 'theme-' + slide.theme]"
          >
            <picture>
              <source media="(max-width: 767px)" :srcset="slide.mobileImage" />
              <img :src="slide.desktopImage" :alt="slide.id" />
            </picture>
            <div class="hero-overlay" :class="'align-' + slide.align.replace(/ /g, '-')">
              <div class="hero-copy" v-if="slide.title || slide.copy">
                <h1 v-if="slide.title">{{ slide.title }}</h1>
                <p v-if="slide.copy">{{ slide.copy }}</p>
              </div>
            </div>
          </article>
          <article v-if="!heroSlides.length" class="hero-slide active theme-dark">
            <div class="hero-overlay align-left-middle">
              <div class="hero-copy">
                <h1 v-if="headersLoading">Loading hero slider...</h1>
                <h1 v-else>Hero slider is not available.</h1>
                <p v-if="contentLoadError">{{ contentLoadError }}</p>
              </div>
            </div>
          </article>
        </div>
        <div v-if="heroSlides.length" class="hero-controls">
          <button @click="prevHero(); startHeroTimer()" aria-label="Previous slide">Prev</button>
          <div class="hero-dots">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id + '-dot'"
              :class="{ active: index === activeHero }"
              @click="setHero(index); startHeroTimer()"
              :aria-label="'Go to slide ' + (index + 1)"
            ></button>
          </div>
          <button @click="nextHero(); startHeroTimer()" aria-label="Next slide">Next</button>
        </div>
      </section>

      <section v-if="stripBanner && stripBanner.desktopImage" class="strip-banner shell">
        <article class="strip-card">
          <picture>
            <source media="(max-width: 767px)" :srcset="stripBanner.mobileImage" />
            <img :src="stripBanner.desktopImage" alt="Promotion banner" />
          </picture>
        </article>
      </section>

      <section id="products" class="product-showcase shell">
        <div class="tab-strip">
          <button class="tab-arrow" type="button" aria-label="Scroll tabs left" @click="scrollProductTabs(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4L7 12l8 8"></path>
            </svg>
          </button>
          <div class="tab-row">
            <button
              v-for="tab in productTabs"
              :key="tab.id"
              :class="{ active: tab.id === activeTab }"
              @click="setActiveTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>
          <button class="tab-arrow" type="button" aria-label="Scroll tabs right" @click="scrollProductTabs(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8"></path>
            </svg>
          </button>
        </div>

        <div v-if="currentProducts.length" class="product-carousel">
          <button class="product-arrow left" type="button" aria-label="Scroll products left" @click="scrollProducts(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4L7 12l8 8"></path>
            </svg>
          </button>
          <div class="product-viewport">
            <div class="product-grid">
              <article v-for="product in currentProducts" :key="product.title" class="product-card">
                <div class="product-card-head">
                  <div v-if="getProductTags(product).length" class="product-tags">
                    <span v-for="tag in getProductTags(product)" :key="tag" class="product-tag">{{ tag }}</span>
                  </div>
                  <button
                    type="button"
                    class="wishlist-button product-wishlist-button"
                    :class="{ active: isWishlisted(product) }"
                    :aria-label="isWishlisted(product) ? 'Remove from wishlist' : 'Add to wishlist'"
                    @click.stop="toggleWishlist(product)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 6.5-6.5L12 7l.6-.6A4.6 4.6 0 1 1 19.1 13L12 20.2Z"></path>
                    </svg>
                  </button>
                </div>
                <a class="product-media" href="#" @click.prevent="goToProduct(product)">
                  <img :src="product.image" :alt="product.title" />
                </a>
                <h3><a href="#" @click.prevent="goToProduct(product)">{{ product.title }}</a></h3>
                <p v-if="product.shortDescription" class="product-card-description">{{ product.shortDescription }}</p>
                <p class="product-sku">{{ product.sku || product.modelNumber }}</p>
                <div class="product-rating">
                  <div class="rating-stars" :class="{ active: (product.rating || 0) > 0 }">
                    <span v-for="(filled, index) in getRatingStars(product.rating)" :key="index">{{ filled ? "★" : "☆" }}</span>
                  </div>
                  <span class="rating-value">{{ (product.rating || 0).toFixed(1) }} ({{ product.reviews || 0 }})</span>
                </div>
                <div class="product-actions">
                  <a class="btn-secondary product-buy-btn" href="#" @click.prevent="goToProduct(product)">{{ product.action }}</a>
                  <button class="compare-btn" type="button">
                    <span class="compare-icon">⊞</span>
                    <span>ADD TO COMPARE</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
          <button class="product-arrow right" type="button" aria-label="Scroll products right" @click="scrollProducts(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8"></path>
            </svg>
          </button>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">+</div>
          <h3>No products are available right now.</h3>
        </div>
      </section>

      <section v-if="promoCards.length" class="promo-cards shell">
        <article v-for="card in promoCards" :key="card.title" class="promo-card">
          <a :href="card.link" target="_blank" rel="noreferrer">
            <picture>
              <source media="(max-width: 767px)" :srcset="card.mobileImage || card.image" />
              <img :src="card.image" :alt="card.title" />
            </picture>
            <div class="promo-copy">
              <h2>{{ card.title }}</h2>
              <span>Find Out More</span>
            </div>
          </a>
        </article>
      </section>

      <section class="mosaic shell">
        <a
          v-for="card in mosaicCards"
          :key="card.title"
          :href="card.link"
          target="_blank"
          rel="noreferrer"
          class="mosaic-card"
          :class="'size-' + card.size"
        >
          <img :src="card.image" :alt="card.title" />
          <div class="mosaic-copy">
            <h2>{{ card.title }}</h2>
          </div>
        </a>
      </section>

      <section v-if="homeCategoryItems.length" class="home-category-showcase shell">
        <div class="tv-category-strip home-category-strip">
          <button class="tv-category-arrow left" type="button" aria-label="Scroll categories left" @click="scrollHomeCategories(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4L7 12l8 8"></path>
            </svg>
          </button>

          <div class="tv-category-viewport home-category-viewport">
            <div class="tv-category-track home-category-track">
              <a
                v-for="item in homeCategoryItems"
                :key="(item.id || item.title) + '-home'"
                :href="item.href"
                class="tv-category-card home-category-card"
                @click.prevent="item.productRef ? goToProduct(item.productRef) : goToRoute('product')"
              >
                <div class="tv-category-media home-category-media">
                  <img :src="item.image" :alt="item.title" />
                </div>
                <strong>{{ item.title }}</strong>
              </a>
            </div>
          </div>

          <button class="tv-category-arrow right" type="button" aria-label="Scroll categories right" @click="scrollHomeCategories(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8"></path>
            </svg>
          </button>
        </div>
      </section>

      <section class="social-section shell">
        <div class="section-head">
          <h2>JOIN THE CONVERSATION</h2>
          <p>Connect with us</p>
        </div>
        <div class="social-grid">
          <a
            v-for="social in socials"
            :key="social.title"
            :href="social.link"
            target="_blank"
            rel="noreferrer"
            class="social-card"
          >
            <img :src="social.icon" :alt="social.title" />
            <span>{{ social.title }}</span>
          </a>
        </div>
      </section>

      <section class="service-section shell">
        <div class="section-head left">
          <h2>LG Product Service and Support</h2>
          <p>Get your questions answered about product setup, use and care, repair and maintenance issues. We can help.</p>
        </div>
        <div class="service-grid">
          <a
            v-for="card in serviceCards"
            :key="card.title"
            :href="card.link"
            target="_blank"
            rel="noreferrer"
            class="service-card"
          >
            <img :src="card.icon" :alt="card.title" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </a>
        </div>
      </section>
    </main>
  `,
};
