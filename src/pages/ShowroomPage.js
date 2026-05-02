export default {
  props: [
    "goToRoute",
    "scrollToPageSection",
    "showroomTabs",
    "showroomHero",
    "showroomLeadFeature",
    "showroomSecondaryHero",
    "showroomExperienceCards",
    "showroomPromiseCards",
    "showroomFinderCountries",
    "showroomLocations",
    "serviceCards",
  ],
  template: `
    <main class="showroom-page">
      <section class="showroom-shell shell">
        <div class="showroom-breadcrumbs">
          <a href="#/" @click.prevent="goToRoute('home')">Home</a>
          <span>/</span>
          <span>BRAND SHOP</span>
        </div>

        <nav class="showroom-tabs" aria-label="Brand shop sections">
          <button
            v-for="tab in showroomTabs"
            :key="tab.id"
            type="button"
            @click="scrollToPageSection(tab.target)"
          >
            {{ tab.label }}
          </button>
        </nav>

        <section class="showroom-hero" id="showroom-top">
          <div class="showroom-hero-copy">
            <p class="showroom-hero-kicker">{{ showroomHero.kicker }}</p>
            <h1>{{ showroomHero.title }}</h1>
            <p class="showroom-hero-note">{{ showroomHero.note }}</p>
            <h2>{{ showroomHero.subtitle }}</h2>
            <p class="showroom-hero-description">{{ showroomHero.description }}</p>
          </div>

          <div class="showroom-hero-media">
            <div class="showroom-collage">
              <article
                v-for="(card, index) in showroomHero.collage"
                :key="card.title + index"
                class="showroom-collage-card"
                :class="'card-' + (index + 1)"
              >
                <img :src="card.image" :alt="card.title" />
                <div class="showroom-collage-overlay">
                  <span>{{ card.title }}</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section class="showroom-intro">
          <div class="section-head centered">
            <h2>The most reliable retailer</h2>
            <p>
              Telionix showrooms are the best place to experience our latest products,
              compare categories side by side, and get trustworthy advice from specialists.
            </p>
          </div>
        </section>

        <section class="showroom-secondary-hero showroom-secondary-hero-reverse">
          <div class="showroom-secondary-media">
            <img :src="showroomLeadFeature.image" :alt="showroomLeadFeature.title" />
          </div>
          <div class="showroom-secondary-copy">
            <p class="showroom-hero-kicker">{{ showroomLeadFeature.kicker }}</p>
            <h2>{{ showroomLeadFeature.title }}</h2>
            <h3>{{ showroomLeadFeature.subtitle }}</h3>
            <p class="showroom-secondary-description">{{ showroomLeadFeature.description }}</p>
          </div>
        </section>

        <section class="showroom-secondary-hero">
          <div class="showroom-secondary-copy">
            <p class="showroom-hero-kicker">{{ showroomSecondaryHero.kicker }}</p>
            <h2>{{ showroomSecondaryHero.title }}</h2>
            <h3>{{ showroomSecondaryHero.subtitle }}</h3>
            <p class="showroom-secondary-description">{{ showroomSecondaryHero.description }}</p>
          </div>
          <div class="showroom-secondary-media">
            <img :src="showroomSecondaryHero.image" :alt="showroomSecondaryHero.title" />
          </div>
        </section>

        <section class="showroom-feature-grid" id="showroom-experience">
          <article
            v-for="card in showroomExperienceCards"
            :key="card.title"
            class="showroom-feature-card"
          >
            <div class="showroom-feature-media">
              <img :src="card.image" :alt="card.title" />
            </div>
            <div class="showroom-feature-copy">
              <p>{{ card.eyebrow }}</p>
              <h3>{{ card.title }}</h3>
              <span v-if="card.caption">{{ card.caption }}</span>
              <p class="showroom-feature-description">{{ card.copy }}</p>
            </div>
          </article>
        </section>

        <section class="showroom-finder" id="showroom-finder">
          <div class="section-head left">
            <h2>Find a Telionix brand shop</h2>
            <p>Choose your country and explore the closest locations ready for visit.</p>
          </div>

          <div class="showroom-finder-toolbar">
            <div class="showroom-country-pills">
              <span
                v-for="country in showroomFinderCountries"
                :key="country"
                class="showroom-country-pill"
              >
                {{ country }}
              </span>
            </div>
            <button class="btn-secondary" type="button" @click="goToRoute('support')">
              Get directions support
            </button>
          </div>

          <div class="showroom-location-grid">
            <article
              v-for="location in showroomLocations"
              :key="location.name"
              class="showroom-location-card"
            >
              <div class="showroom-location-head">
                <strong>{{ location.name }}</strong>
                <span>{{ location.distance }}</span>
              </div>
              <p>{{ location.address }}</p>
              <p>{{ location.phone }}</p>
              <p>{{ location.hours }}</p>
              <div class="showroom-location-tags">
                <span v-for="tag in location.categories" :key="tag">{{ tag }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="showroom-support">
          <div class="section-head left">
            <h2>Product service and support</h2>
            <p>
              Get answers about setup, maintenance, repair, and after-sales service directly from Telionix support.
            </p>
          </div>
          <div class="showroom-support-grid">
            <article v-for="card in serviceCards" :key="card.title" class="showroom-support-card">
              <img :src="card.icon" :alt="card.title" />
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </article>
          </div>
        </section>
      </section>
    </main>
  `,
};
