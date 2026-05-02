export default {
  props: [
    "goToRoute",
    "selectedProduct",
    "selectedProductImage",
    "selectedProductGallery",
    "visibleProductGallery",
    "activeProductMedia",
    "prevProductMedia",
    "nextProductMedia",
    "selectProductMedia",
    "getProductTags",
    "getRatingStars",
    "visibleProductFeatures",
    "detailFeaturesExpanded",
    "toggleDetailFeatures",
    "toggleWishlist",
    "isWishlisted",
  ],
  template: `
    <main class="product-detail-page">
      <section class="product-detail-shell shell">
        <div class="product-breadcrumbs">
          <a href="#/" @click.prevent="goToRoute('home')">Home</a>
          <span>/</span>
          <a href="#/product" @click.prevent="goToRoute('product')">PRODUCTS</a>
          <span>/</span>
          <a href="#/product" @click.prevent="goToRoute('product')">CATEGORY</a>
          <span>/</span>
          <span>{{ selectedProduct.sku }}</span>
        </div>

        <div class="product-detail-grid">
          <div class="product-gallery-column">
            <div class="product-main-image">
              <transition name="product-image" mode="out-in">
                <img
                  :key="selectedProductImage"
                  :src="selectedProductImage"
                  :alt="selectedProduct.title"
                />
              </transition>
            </div>

            <div class="product-thumbs-row">
              <button class="product-thumbs-arrow" type="button" aria-label="Previous media" @click="prevProductMedia">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 4L7 12l8 8"></path>
                </svg>
              </button>

              <div class="product-thumbs">
                <button
                  v-for="item in visibleProductGallery"
                  :key="item.image + item.originalIndex"
                  type="button"
                  class="product-thumb"
                  :class="{ active: item.originalIndex === activeProductMedia }"
                  @click="selectProductMedia(item.originalIndex)"
                >
                  <img :src="item.image" :alt="selectedProduct.title + ' image ' + (item.originalIndex + 1)" />
                </button>
              </div>

              <button class="product-thumbs-arrow" type="button" aria-label="Next media" @click="nextProductMedia">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 4l8 8-8 8"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="product-summary-column">
            <div class="product-summary-head">
              <div class="product-summary-tags">
                <span v-for="tag in getProductTags(selectedProduct)" :key="tag" class="catalog-tag">{{ tag }}</span>
              </div>
              <div class="product-summary-icons">
                <button
                  type="button"
                  class="wishlist-button"
                  :class="{ active: isWishlisted(selectedProduct) }"
                  :aria-label="isWishlisted(selectedProduct) ? 'Remove from wishlist' : 'Add to wishlist'"
                  @click="toggleWishlist(selectedProduct)"
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

            <p class="product-summary-sku">
              <span>{{ selectedProduct.sku }}</span>
              <span class="catalog-copy">[]</span>
            </p>

            <h1>{{ selectedProduct.title }}</h1>

            <div class="product-summary-rating">
              <div class="product-rating-bar" :style="{ '--rating-width': (((selectedProduct.rating || 0) / 5) * 100) + '%' }"></div>
              <div class="catalog-stars">
                <span v-for="(filled, index) in getRatingStars(selectedProduct.rating)" :key="index">{{ filled ? "★" : "☆" }}</span>
              </div>
              <span>({{ selectedProduct.reviews || 0 }})</span>
              <a href="#" @click.prevent>Write a review</a>
            </div>

            <div class="product-feature-panel">
              <div class="product-feature-head">
                <h2>Key Features</h2>
                <button type="button" @click="toggleDetailFeatures">{{ detailFeaturesExpanded ? "-" : "+" }}</button>
              </div>

              <div class="product-feature-box">
                <ul>
                  <li v-for="point in visibleProductFeatures" :key="point">{{ point }}</li>
                </ul>
                <div
                  v-if="detailFeaturesExpanded && selectedProduct.shortDescription"
                  class="product-feature-fulltext"
                >
                  {{ selectedProduct.shortDescription }}
                </div>
                <button type="button" class="product-show-more" @click="toggleDetailFeatures">
                  {{ detailFeaturesExpanded ? "Show Less" : "Show More" }}
                </button>
              </div>
            </div>

            <a
              v-if="selectedProduct.link"
              class="btn-secondary product-detail-buy"
              :href="selectedProduct.link"
              target="_blank"
              rel="noreferrer"
            >
              {{ selectedProduct.action }}
            </a>
            <button v-else class="btn-secondary product-detail-buy" type="button" @click="goToRoute('product')">
              {{ selectedProduct.action || "Back to Products" }}
            </button>

            <button class="product-detail-compare" type="button">
              <span class="compare-icon">⊞</span>
              <span>ADD TO COMPARE</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  `,
};
