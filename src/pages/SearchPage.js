export default {
  props: [
    "searchQuery",
    "setSearchQuery",
    "submitSearch",
    "clearSearchQuery",
    "searchCategorySuggestions",
    "searchProductSuggestions",
    "filteredSearchProducts",
    "searchResultCategoryCounts",
    "activeSearchCategory",
    "setSearchCategory",
    "openCatalogCategory",
    "searchProductsCount",
    "searchSupportCount",
    "goToProductDetail",
    "getProductTags",
    "getRatingStars",
  ],
  data() {
    return {
      searchFocused: false,
    };
  },
  template: `
    <main class="search-page">
      <section class="search-hero shell">
        <div class="search-shell">
          <form class="search-bar-form" @submit.prevent="submitSearch(searchQuery)">
            <div class="search-bar-box">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5"></circle>
                <path d="M16 16l4.5 4.5"></path>
              </svg>
              <input
                :value="searchQuery"
                type="text"
                placeholder="Search products, categories, or SKU"
                @focus="searchFocused = true"
                @blur="setTimeout(() => { searchFocused = false; }, 120)"
                @input="setSearchQuery($event.target.value)"
                @keydown.enter.prevent="submitSearch($event.target.value)"
              />
              <button v-if="searchQuery" type="button" class="search-clear-btn" aria-label="Clear search" @click="clearSearchQuery">
                ×
              </button>
            </div>
          </form>

          <div v-if="searchFocused && !searchQuery" class="search-suggestion-panel">
            <p>Categories</p>
            <div class="search-chip-list search-category-list">
              <button
                v-for="category in searchCategorySuggestions"
                :key="category.slug"
                type="button"
                class="search-chip"
                @mousedown.prevent="openCatalogCategory(category.slug)"
              >
                {{ category.label }}
              </button>
            </div>
          </div>

          <div v-else-if="searchFocused && searchQuery && searchProductSuggestions.length" class="search-suggestion-panel">
            <p>Matching Products</p>
            <div class="search-live-suggestions">
              <button
                v-for="product in searchProductSuggestions"
                :key="product.sku + '-search-suggestion'"
                type="button"
                class="search-live-card"
                @mousedown.prevent="goToProductDetail(product)"
              >
                <img :src="product.image" :alt="product.title" />
                <div>
                  <strong>{{ product.title }}</strong>
                  <span>{{ product.sku }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="search-tabs shell">
        <div class="search-tab-strip">
          <button type="button" class="search-tab active">PRODUCTS ({{ searchProductsCount }})</button>
          <button type="button" class="search-tab">SUPPORT ({{ searchSupportCount }})</button>
        </div>
      </section>

      <section class="search-results shell">
        <aside class="search-filters">
          <div class="search-filter-card">
            <div class="search-filter-head">
              <strong>Products</strong>
              <button v-if="activeSearchCategory" type="button" @click="setSearchCategory('')">Reset</button>
            </div>

            <button
              type="button"
              class="search-filter-item"
              :class="{ active: !activeSearchCategory }"
              @click="setSearchCategory('')"
            >
              <span>All Products</span>
              <strong>{{ searchProductsCount }}</strong>
            </button>

            <button
              v-for="category in searchResultCategoryCounts"
              :key="category.slug"
              type="button"
              class="search-filter-item"
              :class="{ active: activeSearchCategory === category.slug }"
              @click="setSearchCategory(category.slug)"
            >
              <span>{{ category.label }}</span>
              <strong>{{ category.count }}</strong>
            </button>
          </div>
        </aside>

        <div class="search-results-main">
          <div class="search-results-topbar">
            <strong>{{ searchProductsCount }} result{{ searchProductsCount === 1 ? '' : 's' }}</strong>
            <span>Best match</span>
          </div>

          <div v-if="filteredSearchProducts.length" class="catalog-grid search-catalog-grid">
            <article v-for="product in filteredSearchProducts" :key="product.sku + '-search'" class="catalog-card search-catalog-card">
              <div class="catalog-card-head">
                <div v-if="getProductTags(product).length" class="catalog-tags">
                  <span v-for="tag in getProductTags(product)" :key="tag" class="catalog-tag">{{ tag }}</span>
                </div>
              </div>

              <a class="catalog-media" href="#" @click.prevent="goToProductDetail(product)">
                <img :src="product.image" :alt="product.title" />
              </a>

              <h3><a href="#" @click.prevent="goToProductDetail(product)">{{ product.title }}</a></h3>
              <p v-if="product.shortDescription" class="catalog-card-description">{{ product.shortDescription }}</p>
              <p class="catalog-sku">
                <span>{{ product.sku }}</span>
              </p>

              <div class="catalog-rating">
                <div class="catalog-stars">
                  <span v-for="(filled, index) in getRatingStars(product.rating)" :key="index">{{ filled ? "★" : "☆" }}</span>
                </div>
                <span>{{ (product.rating || 0).toFixed(1) }} ({{ product.reviews || 0 }})</span>
              </div>
            </article>
          </div>

          <div v-else class="empty-state search-empty-state">
            <div class="empty-icon">?</div>
            <h3>No products matched your search.</h3>
            <p>Try another keyword, category, or SKU.</p>
          </div>
        </div>
      </section>
    </main>
  `,
};
