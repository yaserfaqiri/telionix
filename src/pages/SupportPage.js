export default {
  props: [
    "goToRoute",
    "supportQuery",
    "setSupportQuery",
    "supportHero",
    "supportHeroImage",
    "supportLoading",
    "supportLoadError",
    "supportNotice",
    "supportMatchedProduct",
    "supportRelatedProducts",
    "supportSolutions",
    "supportHelpCards",
    "supportPromoCards",
    "supportContactMethods",
    "goToProductDetail",
  ],
  template: `
    <main class="support-page">
      <section class="support-shell shell">
        <div class="support-breadcrumbs">
          <a href="#/" @click.prevent="goToRoute('home')">Home</a>
          <span>/</span>
          <span>Support Home</span>
        </div>

        <section class="support-hero-banner">
          <div class="support-hero-fridge">
            <img v-if="supportHeroImage" :src="supportHeroImage" :alt="supportHero.title" />
          </div>
          <div class="support-hero-center">
            <h1>{{ supportHero.title }}</h1>
            <p>{{ supportHero.subtitle }}</p>
            <div class="support-search-box support-search-box-hero">
              <input
                id="support-search"
                :value="supportQuery"
                type="text"
                placeholder="Type Model # or Keyword"
                @input="setSupportQuery($event.target.value)"
              />
              <button type="button" aria-label="Search support">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5"></circle>
                  <path d="M16 16l4.5 4.5"></path>
                </svg>
              </button>
            </div>
            <a href="#" class="support-find-model" @click.prevent>{{ supportHero.findModelText }} []</a>
            <p class="support-signin-note">{{ supportHero.signInNote }}</p>
            <p v-if="supportLoadError" class="support-signin-note">{{ supportLoadError }}</p>
          </div>
        </section>

        <div class="support-notice-bar">
          <strong>{{ supportNotice.label }}</strong>
          <a href="#" @click.prevent>{{ supportNotice.text }}</a>
          <span>{{ supportNotice.date }}</span>
          <div class="support-notice-controls">
            <button type="button" aria-label="Previous notice">&lsaquo;</button>
            <button type="button" aria-label="Pause notice">||</button>
            <button type="button" aria-label="Next notice">&rsaquo;</button>
          </div>
        </div>

        <section v-if="supportQuery.trim()" class="support-model-results">
          <div class="support-section-head">
            <h2>Model Search</h2>
            <p v-if="supportMatchedProduct">Showing result for "{{ supportQuery }}"</p>
            <p v-else>No model matched "{{ supportQuery }}".</p>
          </div>

          <div v-if="supportMatchedProduct" class="support-model-layout">
            <article class="support-model-feature-card">
              <a href="#" class="support-model-feature-link" @click.prevent="goToProductDetail(supportMatchedProduct)">
                <div class="support-model-feature-media">
                  <img :src="supportMatchedProduct.image" :alt="supportMatchedProduct.title" />
                </div>
                <div class="support-model-feature-copy">
                  <span class="support-model-label">Matched Model</span>
                  <h3>{{ supportMatchedProduct.title }}</h3>
                  <p class="support-model-sku">{{ supportMatchedProduct.sku }}</p>
                  <p v-if="supportMatchedProduct.shortDescription" class="support-model-description">{{ supportMatchedProduct.shortDescription }}</p>
                  <span class="support-model-action">View Details</span>
                </div>
              </a>
            </article>

            <div v-if="supportRelatedProducts.length" class="support-related-section">
              <div class="support-section-head compact">
                <h2>More Models In {{ supportMatchedProduct.category }}</h2>
                <p>Related products from the same category</p>
              </div>

              <div class="support-related-grid">
                <article v-for="product in supportRelatedProducts" :key="product.sku" class="support-related-card">
                  <a href="#" @click.prevent="goToProductDetail(product)">
                    <div class="support-related-media">
                      <img :src="product.image" :alt="product.title" />
                    </div>
                    <h3>{{ product.title }}</h3>
                    <p class="support-model-sku">{{ product.sku }}</p>
                    <p v-if="product.shortDescription" class="support-related-description">{{ product.shortDescription }}</p>
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section class="support-solutions-section">
          <div class="support-section-head">
            <h2>Solutions</h2>
            <p>Select a product type first</p>
          </div>
          <div class="support-solutions-wrap">
            <button class="support-solutions-arrow" type="button" aria-label="Previous solutions">&lsaquo;</button>
            <div class="support-solutions-grid">
              <article v-for="item in supportSolutions" :key="item.title" class="support-solution-card">
                <img :src="item.image" :alt="item.title" />
                <h3>{{ item.title }}</h3>
              </article>
            </div>
            <button class="support-solutions-arrow" type="button" aria-label="Next solutions">&rsaquo;</button>
          </div>
        </section>

        <section class="support-help-section">
          <div class="support-help-panel">
            <h2>Whats can we help you with?</h2>
            <div class="support-help-grid">
              <article v-for="card in supportHelpCards" :key="card.title" class="support-help-card">
                <a :href="card.href" target="_blank" rel="noreferrer">
                  <div class="support-help-icon"></div>
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.description }}</p>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section v-if="supportPromoCards.length" class="support-promo-grid">
          <article v-for="card in supportPromoCards" :key="card.title" class="support-promo-card">
            <a :href="card.href" target="_blank" rel="noreferrer">
              <img :src="card.image" :alt="card.title" />
              <div class="support-promo-copy">
                <h3>{{ card.title }}</h3>
                <p>{{ card.subtitle }}</p>
              </div>
            </a>
          </article>
        </section>

        <section class="support-contact-section">
          <h2>Contact</h2>
          <div class="support-contact-row">
            <a
              v-for="item in supportContactMethods"
              :key="item.title"
              :href="item.href"
              target="_blank"
              rel="noreferrer"
              class="support-contact-item"
            >
              <span class="support-contact-icon" :class="'icon-' + item.icon"></span>
              <span>{{ item.title }}</span>
            </a>
          </div>
        </section>
      </section>
    </main>
  `,
};
