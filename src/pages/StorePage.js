export default {
  props: [
    "storeCategoryFilters",
    "activeStoreFilter",
    "setActiveStoreFilter",
    "storeProducts",
    "productsLoading",
    "productLoadError",
    "goToProductDetail",
    "toggleWishlist",
    "isWishlisted",
    "getProductTags",
  ],
  template: `
    <main class="store-story-page">
      <section class="store-story-shell shell">
        <section class="store-story-hero">
          <p class="store-story-kicker">Store</p>
          <h1>Dynamic products from your database</h1>

          <div v-if="storeCategoryFilters.length" class="store-story-filters">
            <button
              v-for="filter in storeCategoryFilters"
              :key="filter.id"
              type="button"
              :class="{ active: filter.id === activeStoreFilter }"
              @click="setActiveStoreFilter(filter.id)"
            >
              {{ filter.label }}
            </button>
          </div>

          <div v-if="storeProducts.length" class="store-story-grid">
            <article v-for="product in storeProducts" :key="product.sku" class="store-story-card store-product-card">
              <div class="store-product-card-head">
                <div v-if="getProductTags(product).length" class="catalog-tags store-product-tags">
                  <span v-for="tag in getProductTags(product)" :key="tag" class="catalog-tag">{{ tag }}</span>
                </div>

                <button
                  type="button"
                  class="wishlist-button store-product-wishlist"
                  :class="{ active: isWishlisted(product) }"
                  :aria-label="isWishlisted(product) ? 'Remove from wishlist' : 'Add to wishlist'"
                  @click.stop="toggleWishlist(product)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 6.5-6.5L12 7l.6-.6A4.6 4.6 0 1 1 19.1 13L12 20.2Z"></path>
                  </svg>
                </button>
              </div>

              <a href="#/" class="store-story-card-link" @click.prevent="goToProductDetail(product)">
                <div class="store-story-card-media">
                  <img :src="product.image" :alt="product.title" />
                </div>

                <div class="store-story-card-copy">
                  <h2>{{ product.title }}</h2>
                  <p v-if="product.shortDescription" class="store-story-card-description">{{ product.shortDescription }}</p>
                  <p class="store-story-card-sku">{{ product.sku }}</p>
                  <span class="store-story-card-action">View Details</span>
                </div>
              </a>
            </article>
          </div>

          <div v-else-if="productsLoading" class="empty-state">
            <div class="empty-icon">...</div>
            <h3>Loading products...</h3>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">+</div>
            <h3>No products are available for this category.</h3>
            <p v-if="productLoadError">{{ productLoadError }}</p>
          </div>
        </section>
      </section>
    </main>
  `,
};
