export default {
  props: [
    "goToRoute",
    "aboutHero",
    "aboutStats",
    "aboutValues",
    "aboutFocusCards",
    "activeAboutFocus",
    "setActiveAboutFocus",
    "aboutClosing",
  ],
  template: `
    <main class="about-page">
      <section class="about-shell shell">
        <div class="about-breadcrumbs">
          <a href="#/" @click.prevent="goToRoute('home')">Home</a>
          <span>/</span>
          <span>About Us</span>
        </div>

        <section class="about-hero">
          <div class="about-hero-copy">
            <p>{{ aboutHero.eyebrow }}</p>
            <h1>{{ aboutHero.title }}</h1>
            <p class="about-hero-description">{{ aboutHero.description }}</p>
          </div>
          <div class="about-hero-media">
            <img :src="aboutHero.image" alt="About Telionix China" />
          </div>
        </section>

        <section class="about-stats">
          <article v-for="item in aboutStats" :key="item.label" class="about-stat-card">
            <strong>{{ item.value }}</strong>
            <p>{{ item.label }}</p>
          </article>
        </section>

        <section class="about-values">
          <div class="section-head left">
            <h2>What guides us</h2>
            <p>We design the experience around usefulness, consistency, and support.</p>
          </div>
          <div class="about-values-grid">
            <article v-for="item in aboutValues" :key="item.title" class="about-value-card">
              <h3>{{ item.title }}</h3>
              <p>{{ item.copy }}</p>
            </article>
          </div>
        </section>

        <section class="about-focus">
          <div class="section-head left">
            <h2>Where we focus</h2>
            <p>Three priorities shape how this platform is presented and maintained.</p>
          </div>
          <div class="about-focus-grid">
            <article
              v-for="(card, index) in aboutFocusCards"
              :key="card.title"
              class="about-focus-card"
              :class="{ active: index === activeAboutFocus }"
              @mouseenter="setActiveAboutFocus(index)"
            >
              <div class="about-focus-media">
                <img :src="card.image" :alt="card.title" />
              </div>
              <div class="about-focus-copy">
                <h3>{{ card.title }}</h3>
                <p>{{ card.copy }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="about-closing">
          <div class="about-closing-copy">
            <h2>{{ aboutClosing.title }}</h2>
            <p>{{ aboutClosing.copy }}</p>
          </div>
          <div class="about-closing-actions">
            <a class="btn-primary" href="#/store" @click.prevent="goToRoute('store')">Explore Store</a>
            <a class="btn-secondary" href="#/support" @click.prevent="goToRoute('support')">Get Support</a>
          </div>
        </section>
      </section>
    </main>
  `,
};
