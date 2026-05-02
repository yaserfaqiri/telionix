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
    "tvPageCategories",
    "scrollTvCategories",
    "tvFilterGroups",
    "tvSortBy",
    "setTvSortBy",
    "tvResultCount",
    "sortedTvPageProducts",
    "getProductTags",
    "getRatingStars",
    "goToProductDetail",
    "toggleWishlist",
    "isWishlisted",
  ],
  template: `
    <main class="category-page">
      <section class="products-hero shell">
        <div class="hero-stage products-hero-stage">
          <article
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            class="hero-slide products-hero-slide"
            :class="[{ active: index === activeHero }, 'theme-' + slide.theme]"
          >
            <picture>
              <source media="(max-width: 767px)" :srcset="slide.mobileImage" />
              <img :src="slide.desktopImage" :alt="slide.id" />
            </picture>

            <div class="hero-overlay products-hero-overlay" :class="'align-' + slide.align.replace(/ /g, '-')">
              <div class="hero-copy products-hero-copy" v-if="slide.title || slide.copy || slide.ctaLabel">
                <h1 v-if="slide.title">{{ slide.title }}</h1>
                <p v-if="slide.copy">{{ slide.copy }}</p>
                <a class="btn-primary" :href="slide.ctaLink" target="_blank" rel="noreferrer">{{ slide.ctaLabel }}</a>
              </div>
            </div>
          </article>

          <article v-if="!heroSlides.length" class="hero-slide products-hero-slide active theme-dark">
            <div class="hero-overlay products-hero-overlay align-left-middle">
              <div class="hero-copy products-hero-copy">
                <h1 v-if="headersLoading">Loading hero slider...</h1>
                <h1 v-else>Hero slider is not available.</h1>
                <p v-if="contentLoadError">{{ contentLoadError }}</p>
              </div>
            </div>
          </article>
        </div>

        <div v-if="heroSlides.length" class="hero-controls products-hero-controls">
          <button type="button" aria-label="Previous slide" @click="prevHero(); startHeroTimer()">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4L7 12l8 8"></path>
            </svg>
          </button>
          <div class="hero-dots">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id + '-product-dot'"
              type="button"
              :class="{ active: index === activeHero }"
              :aria-label="'Go to slide ' + (index + 1)"
              @click="setHero(index); startHeroTimer()"
            ></button>
          </div>
          <button type="button" aria-label="Next slide" @click="nextHero(); startHeroTimer()">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8"></path>
            </svg>
          </button>
        </div>
      </section>

      <section class="tv-page-intro shell">
        <div class="tv-category-strip">
          <button class="tv-category-arrow left" type="button" aria-label="Scroll categories left" @click="scrollTvCategories(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4L7 12l8 8"></path>
            </svg>
          </button>

          <div class="tv-category-viewport tv-page-category-viewport">
            <div class="tv-category-track">
              <a
                v-for="item in tvPageCategories"
                :key="item.id || item.title"
                :href="item.href"
                class="tv-category-card"
                :class="{ 'text-only': !item.image }"
                @click.prevent="item.productRef ? goToProductDetail(item.productRef) : null"
              >
                <div class="tv-category-media">
                  <img v-if="item.image" :src="item.image" :alt="item.title" />
                  <span v-else>{{ item.title }}</span>
                </div>
                <strong>{{ item.title }}</strong>
              </a>
            </div>
          </div>

          <button class="tv-category-arrow right" type="button" aria-label="Scroll categories right" @click="scrollTvCategories(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8"></path>
            </svg>
          </button>
        </div>
      </section>

      <section class="catalog-section shell">
        <aside class="catalog-sidebar">
          <div v-for="group in tvFilterGroups" :key="group.title" class="catalog-filter-group">
            <h3>{{ group.title }}</h3>
            <label v-for="option in group.options" :key="option.label" class="catalog-filter-option">
              <input type="checkbox" />
              <span>{{ option.label }} ({{ option.count }})</span>
            </label>
          </div>
        </aside>

        <div class="catalog-main catalog-main-reference">
          <div class="catalog-toolbar">
            <div class="catalog-sort">
              <label for="tv-sort">Sort By</label>
              <select id="tv-sort" :value="tvSortBy" @change="setTvSortBy($event.target.value)">
                <option>Newest</option>
                <option>Most Popular</option>
                <option>Highest Rated</option>
              </select>
            </div>

            <div class="catalog-results">
              <strong>{{ tvResultCount }}</strong>
              <span>Total Results</span>
              <a href="#/product">View All</a>
            </div>
          </div>

          <div v-if="sortedTvPageProducts.length" class="catalog-grid">
            <article v-for="product in sortedTvPageProducts" :key="product.title + '-catalog'" class="catalog-card">
              <div class="catalog-card-head">
                <div v-if="getProductTags(product).length" class="catalog-tags">
                  <span v-for="tag in getProductTags(product)" :key="tag" class="catalog-tag">{{ tag }}</span>
                </div>

                <div class="catalog-icons">
                  <button
                    type="button"
                    class="wishlist-button"
                    :class="{ active: isWishlisted(product) }"
                    :aria-label="isWishlisted(product) ? 'Remove from wishlist' : 'Add to wishlist'"
                    @click.stop="toggleWishlist(product)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 6.5-6.5L12 7l.6-.6A4.6 4.6 0 1 1 19.1 13L12 20.2Z"></path>
                    </svg>
                  </button>
                  <button type="button" aria-label="Share product">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="18" cy="5" r="2"></circle>
                      <circle cx="6" cy="12" r="2"></circle>
                      <circle cx="18" cy="19" r="2"></circle>
                      <path d="M8 11l8-5"></path>
                      <path d="m8 13 8 5"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <a class="catalog-media" href="#" @click.prevent="goToProductDetail(product)">
                <img :src="product.image" :alt="product.title" />
              </a>

              <h3><a href="#" @click.prevent="goToProductDetail(product)">{{ product.title }}</a></h3>
              <p v-if="product.shortDescription" class="catalog-card-description">{{ product.shortDescription }}</p>
              <p class="catalog-sku">
                <span>{{ product.sku }}</span>
                <span class="catalog-copy">[]</span>
              </p>

              <div class="catalog-rating">
                <div class="catalog-stars">
                  <span v-for="(filled, index) in getRatingStars(product.rating)" :key="index">{{ filled ? "★" : "☆" }}</span>
                </div>
                <span>{{ (product.rating || 0).toFixed(1) }} ({{ product.reviews || 0 }})</span>
              </div>

              <ul class="catalog-bullets">
                <li v-for="point in product.bullets" :key="point">{{ point }}</li>
              </ul>

              <a class="btn-secondary catalog-buy-btn" href="#" @click.prevent="goToProductDetail(product)">
                {{ product.action }}
              </a>
            </article>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">+</div>
            <h3>No products found in the catalog.</h3>
          </div>
        </div>
      </section>
    </main>
  `,
};
