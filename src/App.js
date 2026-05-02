import { nextTick } from "vue";
import HomePage from "./pages/HomePage.js";
import StorePage from "./pages/StorePage.js";
import AboutPage from "./pages/AboutPage.js";
import SupportPage from "./pages/SupportPage.js";
import ProductDetailPage from "./pages/ProductDetailPage.js";
import ProductsPage from "./pages/ProductsPage.js";

function resolvePublicApiBase() {
  const configuredBase = import.meta.env.VITE_PUBLIC_API_BASE_URL;
  if (configuredBase) {
    return configuredBase.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    if (protocol === "file:") {
      return "http://127.0.0.1:4300/api/public";
    }
    if (port && port !== "4300") {
      return `${protocol}//${hostname}:4300/api/public`;
    }
  }

  return "/api/public";
}

const publicApiBase = resolvePublicApiBase();
const siteName = "Telionix China";
const wishlistCookieName = "telionix_wishlist";
const localHomeHref = "#/";

function buildPublicApiUrl(pathname) {
  return `${publicApiBase}${pathname}`;
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readCookieValue(name) {
  if (typeof document === "undefined") {
    return "";
  }

  const cookieEntry = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookieEntry ? cookieEntry.slice(name.length + 1) : "";
}

export default {
  components: {
    HomePage,
    StorePage,
    AboutPage,
    SupportPage,
    ProductDetailPage,
    ProductsPage,
  },
  data() {
    return {
      currentRoute: "home",
      routeQuery: {},
      mobileMenuOpen: false,
      mobileSearchOpen: false,
      mobileSearchQuery: "",
      searchQuery: "",
      searchCategoryFilter: "",
      showScrollTop: false,
      activeDesktopDropdown: null,
      dropdownCloseTimer: null,
      wishlistOpen: false,
      wishlistSkus: [],
      activeHero: 0,
      activeTvFeature: 0,
      activeProductMedia: 0,
      activeProductThumbStart: 0,
      activeTab: "all-products",
      activeAboutFocus: 0,
      activeStoreTab: "helpful-guide",
      activeStoreFilter: "all",
      supportQuery: "",
      supportLoading: false,
      supportLoadError: "",
      supportHeroProductImage: "",
      tvSortBy: "Newest",
      detailPanelOpen: true,
      detailFeaturesExpanded: false,
      heroTimer: null,
      headersLoading: false,
      productsLoading: false,
      contentLoadError: "",
      productLoadError: "",
      randomizedSliderProducts: [],
      menuItems: [
        {
          label: "TV/Video",
          link: localHomeHref,
          children: ["OLED evo", "QNED", "NanoCell", "UHD TVs", "Sound Bars"],
        },
        {
          label: "AUDIO",
          link: localHomeHref,
          children: ["Home Theatre Systems", "Portable Speakers", "Party Speakers"],
        },
        {
          label: "Appliances",
          link: localHomeHref,
          children: ["Refrigerators", "Cooking Appliances", "Dishwashers", "Washing Machines"],
        },
        {
          label: "IT",
          link: localHomeHref,
          children: ["Consumer Monitors", "UltraGear Gaming", "Projectors"],
        },
        {
          label: "Residential AC",
          link: localHomeHref,
          children: ["Tropical Split AC", "Air Purifiers", "Dehumidifier"],
        },
        {
          label: "LG Story",
          link: localHomeHref,
          children: ["Up & Coming", "Helpful Guide", "News"],
        },
        {
          label: "LG Brandshop",
          link: localHomeHref,
          children: ["Official Store", "Promotions"],
        },
        {
          label: "LG AI",
          link: localHomeHref,
          children: ["LG AI TV", "LG AI Appliances", "LG AI Mobility"],
        },
        {
          label: "Support",
          link: localHomeHref,
          children: ["Help Library", "Video Tutorials", "Manuals", "Warranty"],
        },
      ],
      heroSlides: [],
      stripBanner: null,
      productTabs: [
        { id: "all-products", label: "ALL PRODUCTS" },
        { id: "newest", label: "NEWEST" },
        { id: "most-popular", label: "MOST POPULAR" },
        { id: "highly-rated", label: "HIGHLY RATED" },
      ],
      promoCards: [],
      mosaicCards: [
        {
          size: "large",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-1-d.jpg",
          title: '34" UltraWide Gaming Monitor',
          link: localHomeHref,
        },
        {
          size: "medium",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-3-d.jpg",
          title: "Now Meet Artificial Intelligence",
          link: localHomeHref,
        },
        {
          size: "small",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-2-d.jpg",
          title: "Dimensional Sound for Immersion",
          link: localHomeHref,
        },
        {
          size: "wide",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
          title: "LG MiniBeam. Just Put and Watch",
          link: localHomeHref,
        },
      ],
      quickSupport: [
        {
          icon: "https://www.lg.com/ae/images/support/icons/register-your-product.svg",
          title: "Register Your Product",
          link: localHomeHref,
        },
        {
          icon: "https://www.lg.com/ae/images/support/icons/home-iconlink-2.webp",
          title: "Product Support",
          link: localHomeHref,
        },
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-linkicon-3.jpg",
          title: "Repair Provider",
          link: localHomeHref,
        },
      ],
      socials: [
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-sns-1.jpg",
          title: "facebook",
          link: "https://www.facebook.com/profile.php?id=61583806366342",
        },
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/logo-black_DOne%2033.png",
          title: "Twitter",
          link: "https://x.com/_Telionix_",
        },
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-sns-3.jpg",
          title: "YouTube",
          link: "https://www.youtube.com/",
        },
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-sns-4.jpg",
          title: "Instagram",
          link: "https://www.instagram.com/_telionix_china/",
        },
        {
          icon: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-sns-5.jpg",
          title: "WhatsApp",
          link: "https://api.whatsapp.com/send/?phone=0793442006",
        },
      ],
      serviceCards: [
        {
          icon: "https://www.lg.com/ae/images/service_support/ae-b2c-home-linkicon-4.jpg",
          title: "Chat Service",
          description: 'Add "+971 54 3939 054" to your phone contact and connect to LG Customer Service via WhatsApp.',
          link: localHomeHref,
        },
        {
          icon: "https://www.lg.com/ae/images/service_support/ae-b2c-home-linkicon-5.jpg",
          title: "Email Us",
          description: "Send a message to LG Customer Support.",
          link: localHomeHref,
        },
        {
          icon: "https://www.lg.com/ae/images/service_support/ae-b2c-home-linkicon-6.jpg",
          title: "Telephone",
          description: "Afghanistan: 5454\nArmenia: 060 700 333\nAzerbaijan: (+99412) 404 7354",
          link: localHomeHref,
        },
      ],
      footerColumns: [
        {
          title: "Products",
          links: [
            { label: "TV/Video", href: localHomeHref },
            { label: "Audio", href: localHomeHref },
            { label: "Appliances", href: localHomeHref },
            { label: "IT", href: localHomeHref },
            { label: "Residential AC", href: localHomeHref },
          ],
        },
        {
          title: "Support",
          links: [
            { label: "Register a Product", href: localHomeHref },
            { label: "Help Library", href: localHomeHref },
            { label: "Video Tutorials", href: localHomeHref },
            { label: "Warranty", href: localHomeHref },
            { label: "Contact Us", href: localHomeHref },
          ],
        },
        {
          title: "Explore",
          links: [
            { label: "LG AI", href: localHomeHref },
            { label: "LG Brandshop", href: localHomeHref },
            { label: "Promotions", href: localHomeHref },
            { label: "LG Story", href: localHomeHref },
            { label: "About LG", href: localHomeHref },
          ],
        },
      ],
      legalLinks: [
        { label: "HOME", route: "home" },
        { label: "PRODUCTS", route: "product" },
        { label: "Store", route: "store" },
        { label: "About Us", route: "about" },
        { label: "SUPPORT", route: "support" },
      ],
      mobileSearchSuggestions: [
        "Tv",
        "GR-X257CSAV",
        "Ac",
        "Microwave",
        "Refrigerator",
        "Dishwasher",
        "Washing machine",
        "Manuals & Documents",
        "Software & Drivers",
        "Register a Product",
      ],
      mobileQuickLinks: [
        { label: "Sign In", href: localHomeHref },
        { label: "Sign Up", href: localHomeHref },
        { label: "Register a Product", href: localHomeHref },
        { label: "Languages", href: localHomeHref },
      ],
      tvPageHero: {
        title: "TV & Soundbars",
        description: "Explore our extensive collection of smart TVs from standard-size screens to Ultra Big displays. Easily find the best products for your needs whether it be our AI TVs, LG Soundbars, and more.",
      },
      tvPageCategories: [
        {
          title: "OLED",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07605485/md07605485-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "NanoCell",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07597456/md07597456-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "4K TVs",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07604325/md07604325-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Ultra Big TVs",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07610467/md07610467-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Smart TVs",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07603538/md07603538-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "QNED",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07610442/md07610442-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "OLED evo",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07610436/md07610436-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Sound Bars",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07609150/350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "OLED Innovation",
          image: "",
          href: localHomeHref,
        },
        {
          title: "Why QNED evo",
          image: "",
          href: localHomeHref,
        },
        {
          title: "LG AI TV",
          image: "",
          href: localHomeHref,
        },
        {
          title: "TV Buying Guide",
          image: "",
          href: localHomeHref,
        },
      ],
      tvFeatureSlides: [
        {
          eyebrow: "LG SIGNATURE OLED M",
          title: "Meet the first and only OLED TV with wireless connectivity",
          buttonLabel: "KNOW MORE",
          buttonLink: localHomeHref,
          desktopImage: "https://www.lg.com/ae/images/plp-b2c/LG-Free-Soundbar-Cat-EN-PC.jpg",
          mobileImage: "https://www.lg.com/ae/images/plp-b2c/LG-Free-Soundbar-Cat-EN-Mob.jpg",
          notes: [
            "*Screen images simulated.",
            "*Power cable connection to both the TV screen and Zero Connect Box required.",
            "*Stand only compatible with LG SIGNATURE OLED M.",
          ],
          features: [
            { label: "Clutter FREE", icon: "screen" },
            { label: "Location FREE", icon: "pin" },
            { label: "Hassle FREE", icon: "tv" },
          ],
        },
        {
          eyebrow: "LG AI TV",
          title: "The next generation of LG AI TV",
          buttonLabel: "LEARN MORE",
          buttonLink: localHomeHref,
          desktopImage: "https://www.lg.com/ae/images/banner/OSN%20LG-Hero_Home-Desktop.jpg",
          mobileImage: "https://www.lg.com/ae/images/banner/OSN%20LG-Hero_Home-Mobile.jpg",
          notes: [
            "*AI customization features vary by model and region.",
            "*Supported services and applications may differ by market.",
          ],
          features: [
            { label: "AI Picture", icon: "spark" },
            { label: "AI Sound", icon: "sound" },
            { label: "AI Experience", icon: "grid" },
          ],
        },
        {
          eyebrow: "LG OLED",
          title: "A new vision of the good life",
          buttonLabel: "LEARN MORE",
          buttonLink: localHomeHref,
          desktopImage: "https://www.lg.com/ae/images/plp-b2c/b2c-2/Oled_HomePage.jpg",
          mobileImage: "https://www.lg.com/ae/images/plp-b2c/b2c-2/Oled_HomePage.jpg",
          notes: [
            "*Availability of featured models may vary.",
            "*Selected visuals adapted to match this experience.",
          ],
          features: [
            { label: "OLED evo", icon: "screen" },
            { label: "Ultra Thin", icon: "spark" },
            { label: "Pure Contrast", icon: "grid" },
          ],
        },
      ],
      tvFilterGroups: [
        {
          title: "Country",
          options: [
            { label: "United Arab Emirates", count: 25 },
            { label: "GCC", count: 8 },
            { label: "Qatar", count: 15 },
            { label: "Caucasus", count: 3 },
          ],
        },
        {
          title: "Category",
          options: [
            { label: "OLED evo", count: 26 },
            { label: "OLED", count: 35 },
            { label: "QNED", count: 64 },
            { label: "NanoCell", count: 28 },
            { label: "Ultra Big TVs", count: 28 },
            { label: "4K UHD TVs", count: 139 },
            { label: "TV Accessories", count: 15 },
            { label: "All Lifestyle Screens", count: 6 },
          ],
        },
        {
          title: "Screen Size",
          options: [
            { label: "32 inch and smaller", count: 4 },
            { label: "42 - 48 inch", count: 4 },
            { label: "50 inch", count: 6 },
            { label: "55 inch", count: 24 },
            { label: "65 inch", count: 31 },
          ],
        },
      ],
      tvPageProducts: [],
      storeStoryTabs: [
        { id: "up-coming", label: "UP & COMING" },
        { id: "helpful-guide", label: "Helpful Guide" },
        { id: "news", label: "News" },
        { id: "scoop", label: "Scoop" },
        { id: "lifes-good-people", label: "LIFE'S GOOD PEOPLE" },
      ],
      storeStoryFilters: [
        { id: "all", label: "ALL" },
        { id: "entertainment", label: "ENTERTAINMENT" },
        { id: "appliances", label: "APPLIANCES" },
        { id: "air-solutions", label: "Air Solutions" },
        { id: "it-products", label: "IT PRODUCTS" },
      ],
      storeStoryCards: [
        {
          title: "TV",
          category: "entertainment",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07604325/md07604325-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Audio",
          category: "entertainment",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07596475/md07596475-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Wireless Earbuds",
          category: "entertainment",
          image: "https://www.lg.com/ae/images/banner/OSN%20LG-Hero_Home-Mobile.jpg",
          href: localHomeHref,
        },
        {
          title: "Refrigerator",
          category: "appliances",
          image: "https://www.lg.com/ae/images/refrigerators/md07565517/350.jpg",
          href: localHomeHref,
        },
        {
          title: "Washing Machine",
          category: "appliances",
          image: "https://www.lg.com/ae/images/washing-machines/md07576901/350.jpg",
          href: localHomeHref,
        },
        {
          title: "Vacuum Cleaner",
          category: "appliances",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
          href: localHomeHref,
        },
        {
          title: "Dishwasher",
          category: "appliances",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-b2c-home-image-neochef.jpg",
          href: localHomeHref,
        },
        {
          title: "Air Conditioner",
          category: "air-solutions",
          image: "https://www.lg.com/ae/images/plp-b2c/LG-Free-Soundbar-Cat-EN-Mob.jpg",
          href: localHomeHref,
        },
        {
          title: "Air Purifier",
          category: "air-solutions",
          image: "https://www.lg.com/ae/images/banner/LG.Com%20740X1260.jpg",
          href: localHomeHref,
        },
        {
          title: "Monitors",
          category: "it-products",
          image: "https://www.lg.com/ae/images/consumer-monitors/md07609743/md07609743-350x350.jpg",
          href: localHomeHref,
        },
        {
          title: "Projector",
          category: "it-products",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-2-d.jpg",
          href: localHomeHref,
        },
      ],
      storeStoryDescription: [
        "Life's about more than having the latest technology. It's about the experiences technology creates. From TVs and Home Appliances to Air Conditioners and IT products, Telionix delivers consumer electronics that let you embrace life and prepare you for its greatest moments.",
        "Telionix products feature intuitive, responsive designs and are created in a socially responsible way, so you can spend wisely, be more productive and reduce the impact on the world around you. We're committed to providing electronics that work best for the way you live and to keeping you updated with the latest technological advances.",
      ],
      supportSuggestedSearches: ["PC Suite", "OLED TV", "Warranty", "Software", "Manuals"],
      supportHero: {
        title: "Support",
        subtitle: "Welcome to LG Customer Care Team! How can we help you?",
        image: "",
        findModelText: "Find my model #?",
        signInNote: "Please Sign in to select a registered model.",
      },
      supportNotice: {
        label: "NOTICE",
        text: "Notice of termination of the services of Gracenote Music ID / Video ID/ eyeQ EPG for Blu-ray Player/ Blu-ray Home Theater System will no longer be available.",
        date: "11/10/2024",
      },
      supportSolutions: [],
      supportHelpCards: [],
      supportPromoCards: [],
      supportContactMethods: [],
      aboutHero: {
        eyebrow: "About Us",
        title: "Building practical technology for everyday life.",
        description:
          "Telionix China brings together connected home electronics, service support, and product guidance in one unified experience designed for customers across the region.",
        image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-1-d.jpg",
      },
      aboutStats: [
        { value: "12+", label: "Product categories across home, display, and climate solutions" },
        { value: "24/7", label: "Support touchpoints through service, WhatsApp, and online guidance" },
        { value: "100%", label: "Focus on practical design, reliable after-sales, and clear product access" },
      ],
      aboutValues: [
        {
          title: "Customer First",
          copy: "Every page, product, and support flow is structured to help customers move from discovery to purchase and service without friction.",
        },
        {
          title: "Connected Living",
          copy: "We curate TVs, appliances, air solutions, and IT products as one ecosystem so the full experience feels consistent and modern.",
        },
        {
          title: "Reliable Support",
          copy: "From manuals and firmware to warranty guidance and service centers, support is treated as part of the product experience.",
        },
      ],
      aboutFocusCards: [
        {
          title: "Thoughtful Product Curation",
          copy: "We highlight products that balance performance, visual quality, and everyday usefulness across living spaces, kitchens, laundry, and work setups.",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07604325/md07604325-350x350.jpg",
        },
        {
          title: "Service That Stays Visible",
          copy: "Support is not buried. Manuals, software, registration, repair access, and contact channels are surfaced clearly throughout the experience.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
        },
        {
          title: "Design With Consistency",
          copy: "We keep visual language, navigation, and structure aligned across pages so customers always know where they are and what comes next.",
          image: "https://www.lg.com/ae/images/consumer-monitors/md07609743/md07609743-350x350.jpg",
        },
      ],
      aboutClosing: {
        title: "A platform shaped for clarity, trust, and continuity.",
        copy:
          "Telionix China is designed to feel dependable at every step, from product discovery to after-sales care. The goal is not only to showcase products well, but to make the entire journey easier to understand and easier to use.",
      },
      showroomTabs: [
        { id: "experience", label: "YOUR EXPERIENCE", target: "showroom-experience" },
        { id: "promise", label: "OUR PROMISE", target: "showroom-promise" },
        { id: "finder", label: "FIND A SHOWROOM", target: "showroom-finder" },
      ],
      showroomHero: {
        kicker: "SHOWROOM",
        title: "Shop Telionix Electronics in Person",
        note: "*Actual showroom appearance may vary by region.",
        subtitle: "A curated space built around discovery, comparison, and expert advice.",
        description:
          "Visit a Telionix showroom to explore our latest televisions, appliances, air solutions, and IT products in a focused retail environment designed for hands-on experience.",
        collage: [
          {
            title: "Premium TV Zone",
            image: "https://www.lg.com/ae/images/tvs-soundbars/md07605485/md07605485-350x350.jpg",
          },
          {
            title: "Home Appliances",
            image: "https://www.lg.com/ae/images/refrigerators/md07565517/350.jpg",
          },
          {
            title: "Smart Monitors",
            image: "https://www.lg.com/ae/images/consumer-monitors/md07609743/md07609743-350x350.jpg",
          },
          {
            title: "Audio Experience",
            image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-2-d.jpg",
          },
          {
            title: "Connected Living",
            image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
          },
        ],
      },
      showroomSecondaryHero: {
        kicker: "IN-STORE DISCOVERY",
        title: "See categories side by side before you decide.",
        subtitle: "A clearer way to compare display, appliance, and lifestyle products in one place.",
        description:
          "Our brand shop layout is designed to help customers move naturally between product families, compare standout models, and understand the differences that matter most before making a final choice.",
        image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-3-d.jpg",
      },
      showroomLeadFeature: {
        kicker: "GUIDED EXPERIENCE",
        title: "Walk through a retail floor built for clarity.",
        subtitle: "Product zones, cleaner comparisons, and easier decision making from the moment you enter.",
        description:
          "Each brand shop area is organized so customers can understand category differences quickly, see feature highlights more clearly, and explore products in a calmer, more intentional environment.",
        image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
      },
      showroomExperienceCards: [
        {
          eyebrow: "THE BEST PLACE",
          title: "TO SHOP TELIONIX PRODUCTS",
          copy:
            "Browse a wide range of categories in one place and compare standout models with the guidance of our in-store team.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-1-d.jpg",
        },
        {
          eyebrow: "THE LATEST PRODUCTS",
          title: "SEE OUR LATEST TECHNOLOGY IN ACTION",
          caption: "*Product availability may vary by location.",
          copy:
            "Explore current launches, view premium displays up close, and understand real differences across product lines before you buy.",
          image: "https://www.lg.com/ae/images/tvs-soundbars/md07604325/md07604325-350x350.jpg",
        },
        {
          eyebrow: "A WIDE SELECTION",
          title: "FIND YOUR PERFECT MATCH",
          caption: "*Assortment may vary by showroom.",
          copy:
            "From entertainment to kitchen and climate solutions, our showroom lineup helps you find the product that fits your space and routine.",
          image: "https://www.lg.com/ae/images/banner/LG.Com%20740X1260.jpg",
        },
        {
          eyebrow: "EXPERT ADVICE",
          title: "TALK TO A TELIONIX PROFESSIONAL",
          copy:
            "Get practical guidance on features, setup, compatibility, and value from trained product consultants across every category.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-3-d.jpg",
        },
      ],
      showroomPromiseCards: [
        {
          eyebrow: "AN EXPERIENCE",
          title: "BUILT AROUND YOU",
          copy:
            "Every zone is designed to make comparison easier, from display viewing distance to side-by-side feature exploration.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg",
        },
        {
          eyebrow: "CUSTOMER SERVICE",
          title: "OUR COMMITMENT TO YOU",
          copy:
            "Showroom staff are trained to keep the experience clear, respectful, and product-focused from first visit to final decision.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-2-d.jpg",
        },
        {
          eyebrow: "A SAFE ENVIRONMENT",
          title: "YOUR COMFORT COMES FIRST",
          copy:
            "We keep showroom spaces bright, organized, and easy to navigate so every visit feels calm and welcoming.",
          image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-1-d.jpg",
        },
      ],
      showroomFinderCountries: [
        "United Arab Emirates",
        "Qatar",
        "Oman",
        "Bahrain",
        "Kuwait",
        "Pakistan",
      ],
      showroomLocations: [
        {
          name: "Dubai Mall Showroom",
          distance: "4.5 km",
          address: "Level 2, Downtown Dubai, Dubai, United Arab Emirates",
          phone: "+971 4 805 0299",
          hours: "Sun - Thu, 10:00 - 22:00",
          categories: ["TV/Video", "Appliances", "IT"],
        },
        {
          name: "Abu Dhabi Experience Center",
          distance: "9.2 km",
          address: "Corniche District, Abu Dhabi, United Arab Emirates",
          phone: "+971 2 555 2040",
          hours: "Sat - Thu, 10:00 - 22:00",
          categories: ["TV/Video", "Residential AC", "Audio"],
        },
        {
          name: "Sharjah Product Gallery",
          distance: "12.8 km",
          address: "Al Majaz Retail Avenue, Sharjah, United Arab Emirates",
          phone: "+971 6 408 9012",
          hours: "Sun - Thu, 10:00 - 21:30",
          categories: ["Appliances", "Audio", "IT"],
        },
      ],
    };
  },
  computed: {
    isHomeRoute() {
      return this.currentRoute === "home";
    },
    isTvRoute() {
      return this.currentRoute === "product";
    },
    isStoreRoute() {
      return this.currentRoute === "store";
    },
    isShowroomRoute() {
      return this.currentRoute === "showroom";
    },
    isSearchRoute() {
      return this.currentRoute === "search";
    },
    isSupportRoute() {
      return this.currentRoute === "support";
    },
    isAboutRoute() {
      return this.currentRoute === "about";
    },
    isProductRoute() {
      return this.currentRoute.startsWith("product/");
    },
    selectedCatalogCategory() {
      return this.routeQuery.category || "";
    },
    mobileMenuCategories() {
      return this.menuItems.filter((item) => item.label !== "Support");
    },
    normalizedSearchQuery() {
      return String(this.searchQuery || "").trim().toLowerCase();
    },
    searchMatchedProducts() {
      const query = this.normalizedSearchQuery;
      const products = [...this.tvPageProducts];

      if (!query) {
        return products
          .sort((a, b) => (b.views || 0) - (a.views || 0) || this.getProductCreatedTime(b) - this.getProductCreatedTime(a))
          .slice(0, 12);
      }

      return products.filter((product) =>
        [
          product.title,
          product.category,
          product.sku,
          product.shortDescription,
          ...(product.bullets || []),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    },
    searchResultCategoryCounts() {
      const counts = new Map();

      for (const product of this.searchMatchedProducts) {
        const category = product.category || "General";
        counts.set(category, (counts.get(category) || 0) + 1);
      }

      return [...counts.entries()]
        .map(([label, count]) => ({ label, count, slug: createSlug(label) }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    },
    filteredSearchProducts() {
      if (!this.searchCategoryFilter) {
        return this.searchMatchedProducts;
      }

      return this.searchMatchedProducts.filter(
        (product) => createSlug(product.category || "general") === this.searchCategoryFilter
      );
    },
    searchProductSuggestions() {
      const query = this.normalizedSearchQuery;
      const baseProducts = query ? this.searchMatchedProducts : [...this.tvPageProducts];

      return baseProducts
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0) || (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 5);
    },
    searchChipSuggestions() {
      const categoryTags = this.tvPageProducts
        .map((product) => product.category)
        .filter(Boolean)
        .slice(0, 8);

      return [...new Set([...this.mobileSearchSuggestions, ...categoryTags])].slice(0, 10);
    },
    searchCategorySuggestions() {
      return [...new Set(this.tvPageProducts.map((product) => product.category).filter(Boolean))]
        .map((label) => ({ label, slug: createSlug(label) }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    siteCategories() {
      return this.searchCategorySuggestions;
    },
    searchProductsCount() {
      return this.filteredSearchProducts.length;
    },
    searchSupportCount() {
      const query = this.normalizedSearchQuery;
      const supportItems = [...this.supportSolutions, ...this.supportHelpCards, ...this.supportContactMethods];

      if (!query) {
        return supportItems.length;
      }

      return supportItems.filter((item) =>
        [item.title, item.copy, item.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      ).length;
    },
    footerDisplayColumns() {
      return [
        {
          title: "Products",
          kind: "products",
          links: this.siteCategories,
        },
        {
          title: "Support",
          kind: "support",
          links: [{ label: "Support", route: "support" }],
        },
        {
          title: "Store",
          kind: "store",
          links: [{ label: "Store", route: "store" }],
        },
      ];
    },
    currentProducts() {
      const products = [...this.tvPageProducts];

      if (this.activeTab === "newest") {
        return products
          .filter((product) => this.isProductNew(product))
          .sort((a, b) => this.getProductCreatedTime(b) - this.getProductCreatedTime(a))
          .slice(0, 8);
      }

      if (this.activeTab === "most-popular") {
        return products
          .filter((product) => (product.views || 0) > 0)
          .sort((a, b) => (b.views || 0) - (a.views || 0) || (b.reviews || 0) - (a.reviews || 0))
          .slice(0, 8);
      }

      if (this.activeTab === "highly-rated") {
        return products
          .filter((product) => (product.rating || 0) > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
          .slice(0, 8);
      }

      return products.slice(0, 8);
    },
    currentHero() {
      return this.heroSlides[this.activeHero] || null;
    },
    currentTvFeature() {
      return this.tvFeatureSlides[this.activeTvFeature];
    },
    filteredTvPageProducts() {
      if (!this.selectedCatalogCategory) {
        return this.tvPageProducts;
      }

      return this.tvPageProducts.filter((product) => product.categorySlug === this.selectedCatalogCategory);
    },
    sortedTvPageProducts() {
      const products = [...this.filteredTvPageProducts];
      if (this.tvSortBy === "Newest") {
        return products.sort((a, b) => this.getProductCreatedTime(b) - this.getProductCreatedTime(a));
      }
      if (this.tvSortBy === "Highest Rated") {
        return products.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
      }
      if (this.tvSortBy === "Most Popular") {
        return products.sort((a, b) => (b.views || 0) - (a.views || 0) || (b.reviews || 0) - (a.reviews || 0));
      }
      return products;
    },
    tvResultCountValue() {
      return this.sortedTvPageProducts.length;
    },
    selectedProduct() {
      if (!this.isProductRoute) {
        return null;
      }
      const sku = decodeURIComponent(this.currentRoute.replace(/^product\//, ""));
      return this.tvPageProducts.find((product) => product.sku === sku) || null;
    },
    selectedProductGallery() {
      if (!this.selectedProduct) {
        return [];
      }
      return this.selectedProduct.detailGallery?.length
        ? this.selectedProduct.detailGallery
        : [this.selectedProduct.image];
    },
    visibleProductGallery() {
      return this.selectedProductGallery
        .slice(this.activeProductThumbStart, this.activeProductThumbStart + 4)
        .map((image, index) => ({
          image,
          originalIndex: this.activeProductThumbStart + index,
        }));
    },
    homeCategoryItems() {
      if (this.randomizedSliderProducts.length) {
        return this.randomizedSliderProducts;
      }
      return this.tvPageCategories.filter((item) => item.image);
    },
    productSliderItems() {
      if (this.randomizedSliderProducts.length) {
        return this.randomizedSliderProducts;
      }
      return this.tvPageCategories.filter((item) => item.image);
    },
    selectedProductImage() {
      if (!this.selectedProductGallery.length) {
        return "";
      }
      return this.selectedProductGallery[this.activeProductMedia] || this.selectedProductGallery[0];
    },
    visibleProductFeatures() {
      if (!this.selectedProduct) {
        return [];
      }
      const features = this.selectedProduct.detailBullets?.length
        ? this.selectedProduct.detailBullets
        : this.selectedProduct.bullets || [];
      return this.detailFeaturesExpanded ? features : features.slice(0, 3);
    },
    visibleStoreStoryCards() {
      if (this.activeStoreFilter === "all") {
        return this.storeStoryCards;
      }
      return this.storeStoryCards.filter((card) => card.category === this.activeStoreFilter);
    },
    storeCategoryFilters() {
      const categoryMap = new Map();

      this.tvPageProducts.forEach((product) => {
        const slug = product.categorySlug || createSlug(product.category);
        const label = String(product.category || "").trim();

        if (!slug || !label || categoryMap.has(slug)) {
          return;
        }

        categoryMap.set(slug, {
          id: slug,
          label,
        });
      });

      return [
        { id: "all", label: "All" },
        ...Array.from(categoryMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      ];
    },
    storeProducts() {
      const products = this.activeStoreFilter === "all"
        ? this.tvPageProducts
        : this.tvPageProducts.filter((product) => product.categorySlug === this.activeStoreFilter);

      return [...products].sort(
        (a, b) => this.getProductCreatedTime(b) - this.getProductCreatedTime(a) || (b.views || 0) - (a.views || 0)
      );
    },
    currentSupportHeroImage() {
      if (!this.supportHeroProductImage && !this.tvPageProducts.length && !this.productLoadError) {
        return "";
      }

      return this.supportHeroProductImage || this.supportHero.image;
    },
    supportSearchQuery() {
      return String(this.supportQuery || "").trim().toLowerCase();
    },
    supportMatchedProduct() {
      const query = this.supportSearchQuery;
      if (!query) {
        return null;
      }

      return this.tvPageProducts.find((product) => String(product.sku || "").trim().toLowerCase() === query)
        || this.tvPageProducts.find((product) =>
          [product.sku, product.title, product.shortDescription]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        )
        || null;
    },
    supportRelatedProducts() {
      if (!this.supportMatchedProduct) {
        return [];
      }

      return this.tvPageProducts
        .filter((product) =>
          product.sku !== this.supportMatchedProduct.sku
          && product.categorySlug === this.supportMatchedProduct.categorySlug
        )
        .sort(
          (a, b) =>
            this.getProductCreatedTime(b) - this.getProductCreatedTime(a)
            || (b.views || 0) - (a.views || 0)
        )
        .slice(0, 4);
    },
    wishlistCount() {
      return this.wishlistSkus.length;
    },
    wishlistProducts() {
      if (!this.wishlistSkus.length || !this.tvPageProducts.length) {
        return [];
      }

      const productMap = new Map(this.tvPageProducts.map((product) => [product.sku, product]));
      return this.wishlistSkus.map((sku) => productMap.get(sku)).filter(Boolean);
    },
    currentDocumentTitle() {
      if (this.isProductRoute) {
        return this.selectedProduct?.title
          ? `${this.selectedProduct.title} | ${siteName}`
          : `Product Details | ${siteName}`;
      }

      if (this.isTvRoute) {
        return this.selectedCatalogCategory
          ? `${this.getCategoryDisplayName(this.selectedCatalogCategory)} | Products | ${siteName}`
          : `Products | ${siteName}`;
      }

      if (this.isStoreRoute) {
        return `Store | ${siteName}`;
      }

      if (this.isShowroomRoute) {
        return `BRAND SHOP | ${siteName}`;
      }

      if (this.isSearchRoute) {
        return this.searchQuery
          ? `Search: ${this.searchQuery} | ${siteName}`
          : `Search | ${siteName}`;
      }

      if (this.isAboutRoute) {
        return `About Us | ${siteName}`;
      }

      if (this.isSupportRoute) {
        return `Support | ${siteName}`;
      }

      return siteName;
    },
  },
  methods: {
    normalizeProduct(product) {
      const gallery = Array.isArray(product.detailGallery)
        ? product.detailGallery.filter(Boolean)
        : [product.image || product.desktopImage || product.mobileImage].filter(Boolean);
      const detailBullets = Array.isArray(product.detailBullets)
        ? product.detailBullets.filter(Boolean)
        : [];
      const bullets = Array.isArray(product.bullets) && product.bullets.length
        ? product.bullets.filter(Boolean)
        : detailBullets.slice(0, 3);

      return {
        ...product,
        image: product.image || product.desktopImage || product.mobileImage || "",
        desktopImage: product.desktopImage || product.image || product.mobileImage || "",
        mobileImage: product.mobileImage || product.desktopImage || product.image || "",
        badge: product.badge || product.badgeText || "",
        tags: Array.isArray(product.tags) ? product.tags : [],
        rating: Number(product.rating || 0),
        reviews: Number(product.reviews || 0),
        views: Number(product.views || 0),
        createdAt: product.createdAt || product.created_at || "",
        categorySlug: product.categorySlug || createSlug(product.category),
        bullets,
        detailBullets: detailBullets.length ? detailBullets : bullets,
        detailGallery: gallery.length ? gallery : [product.image || product.desktopImage || product.mobileImage].filter(Boolean),
        action: product.action || "View Details",
      };
    },
    shortenSliderTitle(title) {
      const words = String(title || "").trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        return "Product";
      }
      const compact = words.slice(0, 3).join(" ");
      return compact.length > 28 ? `${compact.slice(0, 27)}…` : compact;
    },
    shuffleItems(items) {
      const nextItems = [...items];
      for (let index = nextItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]];
      }
      return nextItems;
    },
    refreshProductSliderItems() {
      const sliderItems = this.tvPageProducts
        .filter((product) => product.image)
        .map((product) => ({
          id: product.sku || product.title,
          title: product.category || this.shortenSliderTitle(product.title),
          image: product.image,
          href: product.sku ? `#/product/${encodeURIComponent(product.sku)}` : "#/tvs-soundbars",
          productRef: product,
        }));

      this.randomizedSliderProducts = this.shuffleItems(sliderItems);
    },
    normalizeHeaderSlide(slide, index) {
      const rawTitle = String(slide.title || "").trim();
      const rawCopy = String(slide.copy || slide.subtitle || "").trim();
      const rawCtaLabel = String(slide.ctaLabel || slide.cta_label || "").trim();

      return {
        id: slide.id || `slide-${index + 1}`,
        title: rawTitle.toLowerCase() === "untitled header slide" ? "" : rawTitle,
        copy: rawCopy,
        desktopImage: slide.desktopImage || slide.desktop_image || "",
        mobileImage: slide.mobileImage || slide.mobile_image || slide.desktopImage || slide.desktop_image || "",
        ctaLabel: rawCtaLabel.toLowerCase() === "learn more" ? "" : rawCtaLabel,
        ctaLink: localHomeHref,
        theme: slide.theme || "dark",
        align: slide.align || "left middle",
      };
    },
    normalizeStripBanner(banner) {
      return {
        id: banner.id,
        desktopImage: banner.desktopImage || banner.desktop_image || "",
        mobileImage: banner.mobileImage || banner.mobile_image || banner.desktopImage || banner.desktop_image || "",
        ctaLabel: banner.ctaLabel || banner.title || "Learn More",
        ctaLink: localHomeHref,
      };
    },
    normalizePromoCard(card) {
      return {
        id: card.id,
        image: card.image || card.desktopImage || card.desktop_image || "",
        mobileImage: card.mobileImage || card.mobile_image || card.image || card.desktopImage || card.desktop_image || "",
        title: card.title || "",
        subtitle: card.subtitle || "",
        link: localHomeHref,
      };
    },
    normalizeSupportContent(payload) {
      return {
        hero: {
          title: payload?.hero?.title || this.supportHero.title,
          subtitle: payload?.hero?.subtitle || this.supportHero.subtitle,
          image: payload?.hero?.image || this.supportHero.image,
          findModelText: payload?.hero?.findModelText || this.supportHero.findModelText,
          signInNote: payload?.hero?.signInNote || this.supportHero.signInNote,
        },
        notice: {
          label: payload?.notice?.label || this.supportNotice.label,
          text: payload?.notice?.text || this.supportNotice.text,
          date: payload?.notice?.date || this.supportNotice.date,
        },
        solutions: Array.isArray(payload?.solutions) ? payload.solutions.filter((item) => item?.title && item?.image) : [],
        helpCards: Array.isArray(payload?.helpCards) ? payload.helpCards.filter((item) => item?.title) : [],
        promoCards: Array.isArray(payload?.promoCards) ? payload.promoCards.filter((item) => item?.title && item?.image) : [],
        contactMethods: Array.isArray(payload?.contactMethods) ? payload.contactMethods.filter((item) => item?.title) : [],
      };
    },
    async fetchHeaderContent() {
      this.headersLoading = true;
      this.contentLoadError = "";

      try {
        const [slidesResponse, bannersResponse, promoCardsResponse] = await Promise.all([
          fetch(buildPublicApiUrl("/header-slides"), {
            headers: { Accept: "application/json" },
          }),
          fetch(buildPublicApiUrl("/banners"), {
            headers: { Accept: "application/json" },
          }),
          fetch(buildPublicApiUrl("/box-banners"), {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!slidesResponse.ok) {
          throw new Error(`Unable to load header slides (${slidesResponse.status})`);
        }

        if (!bannersResponse.ok) {
          throw new Error(`Unable to load banners (${bannersResponse.status})`);
        }

        if (!promoCardsResponse.ok) {
          throw new Error(`Unable to load box banners (${promoCardsResponse.status})`);
        }

        const [slidesData, bannersData, promoCardsData] = await Promise.all([
          slidesResponse.json(),
          bannersResponse.json(),
          promoCardsResponse.json(),
        ]);

        const slides = Array.isArray(slidesData)
          ? slidesData.map((slide, index) => this.normalizeHeaderSlide(slide, index)).filter((slide) => slide.desktopImage)
          : [];
        const banners = Array.isArray(bannersData)
          ? bannersData.map((banner) => this.normalizeStripBanner(banner)).filter((banner) => banner.desktopImage)
          : [];
        const promoCards = Array.isArray(promoCardsData)
          ? promoCardsData.map((card) => this.normalizePromoCard(card)).filter((card) => card.image).slice(0, 3)
          : [];

        this.heroSlides = slides.slice(0, 5);
        this.activeHero = 0;
        this.stripBanner = banners[0] || null;
        this.promoCards = promoCards;
        this.contentLoadError = this.heroSlides.length ? "" : "No active hero slides were found in the database.";
        this.startHeroTimer();
      } catch (error) {
        console.error(error);
        this.heroSlides = [];
        this.activeHero = 0;
        this.stripBanner = null;
        this.promoCards = [];
        this.stopHeroTimer();
        this.contentLoadError = error?.message || "Unable to load header content.";
      } finally {
        this.headersLoading = false;
      }
    },
    async fetchProducts() {
      this.productsLoading = true;
      this.productLoadError = "";

      try {
        const response = await fetch(buildPublicApiUrl("/products"), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load products (${response.status})`);
        }

        const data = await response.json();
        this.tvPageProducts = Array.isArray(data) ? data.map(this.normalizeProduct) : [];
        this.refreshProductSliderItems();
        this.refreshSupportHeroProductImage();
        this.syncWishlistWithProducts();
        this.updateDocumentTitle();
      } catch (error) {
        console.error(error);
        this.tvPageProducts = [];
        this.randomizedSliderProducts = [];
        this.supportHeroProductImage = "";
        this.productLoadError = error?.message || "Unable to load products.";
        this.updateDocumentTitle();
      } finally {
        this.productsLoading = false;
      }
    },
    refreshSupportHeroProductImage() {
      const candidates = this.tvPageProducts
        .map((product) => product.desktopImage || product.image || product.mobileImage)
        .filter(Boolean);

      if (!candidates.length) {
        this.supportHeroProductImage = "";
        return;
      }

      const alternativeCandidates = candidates.filter((image) => image !== this.supportHeroProductImage);
      const pool = alternativeCandidates.length ? alternativeCandidates : candidates;
      const randomIndex = Math.floor(Math.random() * pool.length);
      this.supportHeroProductImage = pool[randomIndex] || candidates[0];
    },
    async fetchSupportContent() {
      this.supportLoading = true;
      this.supportLoadError = "";

      try {
        const response = await fetch(buildPublicApiUrl("/support-content"), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load support content (${response.status})`);
        }

        const data = await response.json();
        const normalized = this.normalizeSupportContent(data);
        this.supportHero = normalized.hero;
        this.supportNotice = normalized.notice;
        this.supportSolutions = normalized.solutions;
        this.supportHelpCards = normalized.helpCards;
        this.supportPromoCards = normalized.promoCards;
        this.supportContactMethods = normalized.contactMethods;
      } catch (error) {
        console.error(error);
        this.supportLoadError = error?.message || "Unable to load support content.";
      } finally {
        this.supportLoading = false;
      }
    },
    nextHero() {
      if (!this.heroSlides.length) {
        return;
      }
      this.activeHero = (this.activeHero + 1) % this.heroSlides.length;
    },
    prevHero() {
      if (!this.heroSlides.length) {
        return;
      }
      this.activeHero = (this.activeHero - 1 + this.heroSlides.length) % this.heroSlides.length;
    },
    setHero(index) {
      if (!this.heroSlides.length) {
        return;
      }
      this.activeHero = index;
    },
    isProductNew(product) {
      const tags = [product.badge, ...(product.tags || [])]
        .map((item) => String(item || "").trim().toUpperCase())
        .filter(Boolean);
      return tags.includes("NEW");
    },
    getProductCreatedTime(product) {
      const value = product?.createdAt ? Date.parse(product.createdAt) : 0;
      return Number.isFinite(value) ? value : 0;
    },
    getProductTags(product) {
      if (product.tags?.length) {
        return product.tags;
      }
      const badge = product.badge || product.badgeText;
      if (badge === "NEW") {
        return ["NEW", "COMING SOON"];
      }
      if (badge === "Offer") {
        return ["HOT", "LIMITED OFFER"];
      }
      return badge ? [badge] : [];
    },
    getRatingStars(rating) {
      const rounded = Math.round(rating || 0);
      return Array.from({ length: 5 }, (_, index) => index < rounded);
    },
    getCategoryDisplayName(categorySlug) {
      const matchedProduct = this.tvPageProducts.find((product) => product.categorySlug === categorySlug);
      if (matchedProduct?.category) {
        return matchedProduct.category;
      }

      return String(categorySlug || "")
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    },
    updateDocumentTitle() {
      if (typeof document !== "undefined") {
        document.title = this.currentDocumentTitle;
      }
    },
    readWishlistCookie() {
      try {
        const cookieValue = readCookieValue(wishlistCookieName);
        if (!cookieValue) {
          return [];
        }

        const parsed = JSON.parse(decodeURIComponent(cookieValue));
        if (!Array.isArray(parsed)) {
          return [];
        }

        return [...new Set(parsed.map((sku) => String(sku || "").trim()).filter(Boolean))];
      } catch (error) {
        console.error("Unable to parse wishlist cookie.", error);
        return [];
      }
    },
    writeWishlistCookie() {
      if (typeof document === "undefined") {
        return;
      }

      const expires = new Date();
      expires.setDate(expires.getDate() + 365);
      document.cookie = [
        `${wishlistCookieName}=${encodeURIComponent(JSON.stringify(this.wishlistSkus))}`,
        "path=/",
        `expires=${expires.toUTCString()}`,
        "SameSite=Lax",
      ].join("; ");
    },
    syncWishlistWithProducts() {
      if (!this.wishlistSkus.length || !this.tvPageProducts.length) {
        return;
      }

      const validSkus = new Set(this.tvPageProducts.map((product) => product.sku));
      const nextWishlist = this.wishlistSkus.filter((sku) => validSkus.has(sku));

      if (nextWishlist.length !== this.wishlistSkus.length) {
        this.wishlistSkus = nextWishlist;
        this.writeWishlistCookie();
      }
    },
    isWishlisted(product) {
      return Boolean(product?.sku) && this.wishlistSkus.includes(product.sku);
    },
    toggleWishlist(product) {
      if (!product?.sku) {
        return;
      }

      if (this.isWishlisted(product)) {
        this.wishlistSkus = this.wishlistSkus.filter((sku) => sku !== product.sku);
      } else {
        this.wishlistSkus = [product.sku, ...this.wishlistSkus.filter((sku) => sku !== product.sku)];
      }

      this.writeWishlistCookie();
    },
    removeFromWishlist(product) {
      if (!product?.sku || !this.isWishlisted(product)) {
        return;
      }

      this.wishlistSkus = this.wishlistSkus.filter((sku) => sku !== product.sku);
      this.writeWishlistCookie();
    },
    toggleWishlistDropdown() {
      this.wishlistOpen = !this.wishlistOpen;
    },
    closeWishlistDropdown() {
      this.wishlistOpen = false;
    },
    handleWishlistProductClick(product) {
      this.closeWishlistDropdown();
      this.goToProductDetail(product);
    },
    handleDocumentClick(event) {
      if (!event.target.closest(".wishlist-shell")) {
        this.closeWishlistDropdown();
      }
    },
    updateRouteFromHash() {
      const previousRoute = this.currentRoute;
      const hash = window.location.hash.replace(/^#\/?/, "").trim();
      const [routePart, queryString = ""] = hash.split("?");
      this.currentRoute = routePart || "home";
      this.routeQuery = Object.fromEntries(new URLSearchParams(queryString));
      if (this.currentRoute === "search") {
        this.searchQuery = this.routeQuery.q || "";
        this.searchCategoryFilter = this.routeQuery.category || "";
      } else {
        this.searchCategoryFilter = "";
      }
      this.activeProductMedia = 0;
      this.activeProductThumbStart = 0;
      this.detailPanelOpen = true;
      this.detailFeaturesExpanded = false;
      this.closeWishlistDropdown();
      if (this.currentRoute === "support" && previousRoute !== "support") {
        this.refreshSupportHeroProductImage();
      }
      this.updateDocumentTitle();
    },
    goToRoute(route, query = {}) {
      const params = new URLSearchParams(
        Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
      );
      const suffix = params.toString() ? `?${params.toString()}` : "";

      if (!route || route === "home") {
        window.location.hash = "";
      } else {
        window.location.hash = `/${route}${suffix}`;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToPageSection(sectionId) {
      if (typeof document === "undefined" || !sectionId) {
        return;
      }

      const element = document.getElementById(sectionId);
      if (!element) {
        return;
      }

      const headerOffset = 118;
      const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    },
    openSearchPage(initialQuery = "") {
      this.searchQuery = initialQuery;
      this.searchCategoryFilter = "";
      this.goToRoute("search", initialQuery ? { q: initialQuery } : {});
    },
    setSearchQuery(value) {
      this.searchQuery = value;
      this.searchCategoryFilter = "";
      this.updateDocumentTitle();
    },
    submitSearch(value = this.searchQuery) {
      const nextQuery = String(value || "").trim();
      this.searchQuery = nextQuery;
      this.goToRoute("search", {
        q: nextQuery || undefined,
        category: this.searchCategoryFilter || undefined,
      });
    },
    clearSearchQuery() {
      this.searchQuery = "";
      this.searchCategoryFilter = "";
      this.goToRoute("search");
    },
    applySearchSuggestion(value) {
      this.searchQuery = String(value || "").trim();
      this.searchCategoryFilter = "";
      this.submitSearch(this.searchQuery);
    },
    setSearchCategory(categorySlug = "") {
      this.searchCategoryFilter = categorySlug;
      this.goToRoute("search", {
        q: this.searchQuery || undefined,
        category: categorySlug || undefined,
      });
    },
    openCatalogCategory(categorySlug = "") {
      if (!categorySlug) {
        this.goToRoute("product");
        return;
      }
      this.goToRoute("product", { category: categorySlug });
    },
    goToProduct(product) {
      if (!product?.category) {
        this.goToRoute("product");
        return;
      }
      this.goToRoute("product", {
        category: product.categorySlug || createSlug(product.category),
      });
    },
    goToProductDetail(product) {
      if (!product?.sku) {
        return;
      }
      window.location.hash = `/product/${encodeURIComponent(product.sku)}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    setActiveAboutFocus(index) {
      this.activeAboutFocus = index;
    },
    setActiveStoreTab(tabId) {
      this.activeStoreTab = tabId;
    },
    setActiveStoreFilter(filterId) {
      this.activeStoreFilter = filterId;
    },
    setSupportQuery(value) {
      this.supportQuery = value;
    },
    setTvSortBy(value) {
      this.tvSortBy = value;
    },
    scrollBySelector(selector, ratio, direction) {
      const viewport = document.querySelector(selector);
      if (!viewport) {
        return;
      }
      viewport.scrollBy({ left: viewport.clientWidth * ratio * direction, behavior: "smooth" });
    },
    scrollHomeCategories(direction) {
      this.scrollBySelector(".home-category-viewport", 0.76, direction);
    },
    selectProductMedia(index) {
      this.activeProductMedia = index;
      this.syncProductThumbWindow();
    },
    prevProductMedia() {
      if (!this.selectedProductGallery.length) {
        return;
      }
      this.activeProductMedia =
        (this.activeProductMedia - 1 + this.selectedProductGallery.length) % this.selectedProductGallery.length;
      this.syncProductThumbWindow();
    },
    nextProductMedia() {
      if (!this.selectedProductGallery.length) {
        return;
      }
      this.activeProductMedia = (this.activeProductMedia + 1) % this.selectedProductGallery.length;
      this.syncProductThumbWindow();
    },
    syncProductThumbWindow() {
      const maxVisibleThumbs = 4;
      const total = this.selectedProductGallery.length;

      if (total <= maxVisibleThumbs) {
        this.activeProductThumbStart = 0;
        return;
      }

      if (this.activeProductMedia < this.activeProductThumbStart) {
        this.activeProductThumbStart = this.activeProductMedia;
        return;
      }

      const windowEnd = this.activeProductThumbStart + maxVisibleThumbs - 1;
      if (this.activeProductMedia > windowEnd) {
        this.activeProductThumbStart = this.activeProductMedia - maxVisibleThumbs + 1;
      }
    },
    toggleDetailPanel() {
      this.detailPanelOpen = !this.detailPanelOpen;
    },
    toggleDetailFeatures() {
      this.detailFeaturesExpanded = !this.detailFeaturesExpanded;
    },
    openDesktopDropdown(name) {
      this.cancelDesktopDropdownClose();
      this.activeDesktopDropdown = name;
    },
    scheduleCloseDesktopDropdown() {
      this.cancelDesktopDropdownClose();
      this.dropdownCloseTimer = window.setTimeout(() => {
        this.activeDesktopDropdown = null;
      }, 140);
    },
    cancelDesktopDropdownClose() {
      if (this.dropdownCloseTimer) {
        window.clearTimeout(this.dropdownCloseTimer);
        this.dropdownCloseTimer = null;
      }
    },
    scrollProductTabs(direction) {
      this.scrollBySelector(".tab-row", 0.42, direction);
    },
    scrollProducts(direction) {
      this.scrollBySelector(".product-viewport", 0.88, direction);
    },
    scrollTvProducts(direction) {
      this.scrollBySelector(".tv-products-viewport", 0.88, direction);
    },
    scrollTvCategories(direction) {
      this.scrollBySelector(".tv-page-category-viewport", 0.76, direction);
    },
    nextTvFeature() {
      this.activeTvFeature = (this.activeTvFeature + 1) % this.tvFeatureSlides.length;
    },
    prevTvFeature() {
      this.activeTvFeature = (this.activeTvFeature - 1 + this.tvFeatureSlides.length) % this.tvFeatureSlides.length;
    },
    setTvFeature(index) {
      this.activeTvFeature = index;
    },
    handleWindowScroll() {
      this.showScrollTop = window.scrollY > 260;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    openMobileMenu() {
      this.closeWishlistDropdown();
      this.mobileSearchOpen = false;
      this.mobileMenuOpen = true;
    },
    openMobileSearch() {
      this.closeWishlistDropdown();
      this.mobileMenuOpen = false;
      this.mobileSearchOpen = true;
      nextTick(() => {
        document.querySelector(".mobile-search-input input")?.focus();
      });
    },
    closeMobilePanels() {
      this.mobileMenuOpen = false;
      this.mobileSearchOpen = false;
    },
    startHeroTimer() {
      this.stopHeroTimer();
      if (this.heroSlides.length <= 1) {
        return;
      }
      this.heroTimer = window.setInterval(() => {
        this.nextHero();
      }, 5000);
    },
    stopHeroTimer() {
      if (this.heroTimer) {
        window.clearInterval(this.heroTimer);
        this.heroTimer = null;
      }
    },
  },
  mounted() {
    this.wishlistSkus = this.readWishlistCookie();
    this.updateRouteFromHash();
    this.updateDocumentTitle();
    this.fetchHeaderContent();
    this.fetchProducts();
    this.fetchSupportContent();
    this.startHeroTimer();
    window.addEventListener("scroll", this.handleWindowScroll, { passive: true });
    window.addEventListener("hashchange", this.updateRouteFromHash);
    document.addEventListener("click", this.handleDocumentClick);
    this.handleWindowScroll();
  },
  beforeUnmount() {
    this.stopHeroTimer();
    this.cancelDesktopDropdownClose();
    window.removeEventListener("scroll", this.handleWindowScroll);
    window.removeEventListener("hashchange", this.updateRouteFromHash);
    document.removeEventListener("click", this.handleDocumentClick);
  },
  template: `
    <div class="page-shell">
      <a class="floating-whatsapp" href="https://api.whatsapp.com/send/?phone=0793442006" target="_blank" rel="noreferrer">
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
            <a class="lg-logo" href="/">
              <img src="/telionix-logo.png" alt="Telionix" />
            </a>
          </div>

          <div class="header-right">
            <div class="header-topline">
              <div class="brand-wordmarks">
                <a href="/">Telionix China</a>
              </div>

              <a class="business-pill" href="https://www.lg.com/ae/business">For Business</a>
            </div>

            <div class="header-bottomline">
              <nav class="primary-links">
                <a href="/">HOME</a>
                <span class="primary-divider"></span>
                <div
                  class="primary-item has-panel"
                  @mouseenter="openDesktopDropdown('products')"
                  @mouseleave="scheduleCloseDesktopDropdown"
                >
                  <a href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">PRODUCTS</a>
                  <div
                    class="products-dropdown"
                    :class="{ open: activeDesktopDropdown === 'products' }"
                    @mouseenter="openDesktopDropdown('products')"
                    @mouseleave="scheduleCloseDesktopDropdown"
                  >
                    <div class="products-dropdown-inner shell">
                      <a
                        v-for="item in menuItems.slice(0, 8)"
                        :key="item.label"
                        :href="item.link"
                        class="dropdown-category-card"
                        target="_blank"
                        rel="noreferrer"
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
                <a href="https://www.lg.com/ae" aria-label="Language">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M3 12h18"></path>
                    <path d="M12 3a15 15 0 0 1 0 18"></path>
                    <path d="M12 3a15 15 0 0 0 0 18"></path>
                  </svg>
                </a>
                <a href="https://www.lg.com/ae/my-lg/login" aria-label="My LG">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
                  </svg>
                </a>
                <a href="https://www.lg.com/ae/search/search-all?search=" aria-label="Search">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="M16 16l4.5 4.5"></path>
                  </svg>
                </a>
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

            <a class="mobile-center-logo" href="/">
              <img src="/telionix-logo.png" alt="Telionix" />
            </a>

            <a class="mobile-icon-btn" href="https://www.lg.com/ae/my-lg/login" aria-label="My LG">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
              </svg>
            </a>
          </div>

          <div class="mobile-brand-strip">
            <a href="/">Telionix China</a>
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
                    ref="mobileSearchInput"
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
                <a class="mobile-menu-logo" href="/">
                  <img src="/telionix-logo.png" alt="Telionix" />
                </a>
                <a class="mobile-icon-btn" href="https://www.lg.com/ae/my-lg/login" aria-label="My LG">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4.5 20c1.7-3.5 4.2-5.2 7.5-5.2s5.8 1.7 7.5 5.2"></path>
                  </svg>
                </a>
              </div>

              <div class="mobile-menu-brands">
                <a href="/">Telionix China</a>
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
                  <span class="mobile-menu-arrow">›</span>
                </a>
                <a href="#/support" class="mobile-menu-link" @click.prevent="goToRoute('support'); closeMobilePanels()">
                  <span>SUPPORT</span>
                  <span class="mobile-menu-arrow">›</span>
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
                  <span v-if="link.label === 'Languages'" class="mobile-menu-arrow">›</span>
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

      <main v-if="isHomeRoute">
        <section class="hero shell">
          <div class="hero-stage">
            <article
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              class="hero-slide"
              :class="[
                { active: index === activeHero },
                'theme-' + slide.theme
              ]"
            >
              <picture>
                <source media="(max-width: 767px)" :srcset="slide.mobileImage" />
                <img :src="slide.desktopImage" :alt="slide.id" />
              </picture>
              <div class="hero-overlay" :class="'align-' + slide.align.replace(/ /g, '-')">
                <div class="hero-copy" v-if="slide.title || slide.copy || slide.ctaLabel">
                  <h1 v-if="slide.title">{{ slide.title }}</h1>
                  <p v-if="slide.copy">{{ slide.copy }}</p>
                  <a class="btn-primary" :href="slide.ctaLink" target="_blank" rel="noreferrer">{{ slide.ctaLabel }}</a>
                </div>
              </div>
            </article>
          </div>
          <div class="hero-controls">
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

        <section class="strip-banner shell">
          <article class="strip-card">
            <picture>
              <source media="(max-width: 767px)" :srcset="stripBanner.mobileImage" />
              <img :src="stripBanner.desktopImage" alt="Promotion banner" />
            </picture>
            <a class="btn-primary btn-overlay" :href="stripBanner.ctaLink" target="_blank" rel="noreferrer">{{ stripBanner.ctaLabel }}</a>
          </article>
        </section>

        <section id="products" class="product-showcase shell">
          <div class="tab-strip">
            <button class="tab-arrow" type="button" aria-label="Scroll tabs left" @click="scrollProductTabs(-1)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 4L7 12l8 8"></path>
              </svg>
            </button>
            <div ref="productTabsRow" class="tab-row">
              <button
                v-for="tab in productTabs"
                :key="tab.id"
                :class="{ active: tab.id === activeTab }"
                @click="activeTab = tab.id"
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
            <div ref="productsViewport" class="product-viewport">
              <div class="product-grid">
                <article v-for="product in currentProducts" :key="product.title" class="product-card">
                  <div v-if="getProductTags(product).length" class="product-tags">
                    <span v-for="tag in getProductTags(product)" :key="tag" class="product-tag">{{ tag }}</span>
                  </div>
                  <a class="product-media" href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">
                    <img :src="product.image" :alt="product.title" />
                  </a>
                  <h3><a href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">{{ product.title }}</a></h3>
                  <div class="product-rating">
                    <div class="rating-stars" :class="{ active: (product.rating || 0) > 0 }">
                      <span v-for="(filled, index) in getRatingStars(product.rating)" :key="index">{{ filled ? "★" : "★" }}</span>
                    </div>
                    <span class="rating-value">{{ (product.rating || 0).toFixed(1) }} ({{ product.reviews || 0 }})</span>
                  </div>
                  <div class="product-actions">
                    <a class="btn-secondary product-buy-btn" href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">{{ product.action }}</a>
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
            <h3>There are no recently viewed products.</h3>
          </div>
        </section>

        <section class="promo-cards shell">
          <article v-for="card in promoCards" :key="card.title" class="promo-card">
            <a :href="card.link" target="_blank" rel="noreferrer">
              <img :src="card.image" :alt="card.title" />
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

            <div ref="homeCategoriesViewport" class="tv-category-viewport">
              <div class="tv-category-track home-category-track">
                <a
                  v-for="item in homeCategoryItems"
                  :key="item.title + '-home'"
                  :href="item.href"
                  target="_blank"
                  rel="noreferrer"
                  class="tv-category-card home-category-card"
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

      <main v-else-if="isStoreRoute" class="store-story-page">
        <section class="store-story-shell shell">
          <nav class="store-story-tabs" aria-label="Store tabs">
            <button
              v-for="tab in storeStoryTabs"
              :key="tab.id"
              type="button"
              :class="{ active: tab.id === activeStoreTab }"
              @click="activeStoreTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>

          <section class="store-story-hero">
            <p class="store-story-kicker"># Essentials</p>
            <h1>Tech that improves your daily life</h1>

            <div class="store-story-filters">
              <button
                v-for="filter in storeStoryFilters"
                :key="filter.id"
                type="button"
                :class="{ active: filter.id === activeStoreFilter }"
                @click="activeStoreFilter = filter.id"
              >
                {{ filter.label }}
              </button>
            </div>

            <div class="store-story-grid">
              <article v-for="card in visibleStoreStoryCards" :key="card.title" class="store-story-card">
                <a :href="card.href" target="_blank" rel="noreferrer">
                  <div class="store-story-card-media">
                    <img :src="card.image" :alt="card.title" />
                  </div>
                  <h2>{{ card.title }}</h2>
                  <span>Explore</span>
                </a>
              </article>
            </div>

            <div class="store-story-copy">
              <p v-for="paragraph in storeStoryDescription" :key="paragraph">{{ paragraph }}</p>
            </div>
          </section>
        </section>
      </main>

      <main v-else-if="isAboutRoute" class="about-page">
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
                @mouseenter="activeAboutFocus = index"
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

      <main v-else-if="isSupportRoute" class="support-page">
        <section class="support-shell shell">
          <div class="support-breadcrumbs">
            <a href="#/" @click.prevent="goToRoute('home')">Home</a>
            <span>/</span>
            <span>Support Home</span>
          </div>

          <section class="support-hero-banner">
            <div class="support-hero-fridge">
              <img src="https://www.lg.com/ae/images/refrigerators/md07565517/350.jpg" alt="Refrigerator" />
            </div>
            <div class="support-hero-center">
              <h1>Support</h1>
              <p>Welcome to LG Customer Care Team! How can we help you?</p>
              <div class="support-search-box support-search-box-hero">
                <input
                  id="support-search"
                  v-model="supportQuery"
                  type="text"
                  placeholder="Type Model # or Keyword"
                />
                <button type="button" aria-label="Search support">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="M16 16l4.5 4.5"></path>
                  </svg>
                </button>
              </div>
              <a href="#" class="support-find-model" @click.prevent>Find my model #? □</a>
              <p class="support-signin-note">Please Sign in to select a registered model.</p>
            </div>
          </section>

          <div class="support-notice-bar">
            <strong>{{ supportNotice.label }}</strong>
            <a href="#" @click.prevent>{{ supportNotice.text }}</a>
            <span>{{ supportNotice.date }}</span>
            <div class="support-notice-controls">
              <button type="button" aria-label="Previous notice">‹</button>
              <button type="button" aria-label="Pause notice">Ⅱ</button>
              <button type="button" aria-label="Next notice">›</button>
            </div>
          </div>

          <section class="support-solutions-section">
            <div class="support-section-head">
              <h2>Solutions</h2>
              <p>Select a product type first</p>
            </div>
            <div class="support-solutions-wrap">
              <button class="support-solutions-arrow" type="button" aria-label="Previous solutions">‹</button>
              <div class="support-solutions-grid">
                <article v-for="item in supportSolutions" :key="item.title" class="support-solution-card">
                  <img :src="item.image" :alt="item.title" />
                  <h3>{{ item.title }}</h3>
                </article>
              </div>
              <button class="support-solutions-arrow" type="button" aria-label="Next solutions">›</button>
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

          <section class="support-promo-grid">
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

      <main v-else-if="isProductRoute && selectedProduct" class="product-detail-page">
        <section class="product-detail-shell shell">
          <div class="product-breadcrumbs">
            <a href="#/" @click.prevent="goToRoute('home')">Home</a>
            <span>/</span>
            <a href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">TV/VIDEO</a>
            <span>/</span>
            <a href="#/tvs-soundbars" @click.prevent="goToRoute('tvs-soundbars')">TVS/SOUNDBARS</a>
            <span>/</span>
            <span>{{ selectedProduct.sku }}</span>
          </div>

          <div class="product-detail-grid">
            <div class="product-gallery-column">
              <div class="product-main-image">
                <img :src="selectedProductImage" :alt="selectedProduct.title" />
              </div>

              <div class="product-thumbs-row">
                <button class="product-thumbs-arrow" type="button" aria-label="Previous media" @click="prevProductMedia">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 4L7 12l8 8"></path>
                  </svg>
                </button>

                <div class="product-thumbs">
                  <button
                    v-for="(image, index) in selectedProductGallery"
                    :key="image + index"
                    type="button"
                    class="product-thumb"
                    :class="{ active: index === activeProductMedia }"
                    @click="selectProductMedia(index)"
                  >
                    <img :src="image" :alt="selectedProduct.title + ' image ' + (index + 1)" />
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
                  <span>0</span>
                  <button type="button" aria-label="Add to wishlist">
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
                <span class="catalog-copy">□</span>
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
                  <button type="button" @click="toggleDetailFeatures">{{ detailFeaturesExpanded ? "−" : "+" }}</button>
                </div>

                <div class="product-feature-box">
                  <ul>
                    <li v-for="point in visibleProductFeatures" :key="point">{{ point }}</li>
                  </ul>
                  <button type="button" class="product-show-more" @click="toggleDetailFeatures">
                    {{ detailFeaturesExpanded ? "Show Less" : "Show More" }}
                  </button>
                </div>
              </div>

              <a class="btn-secondary product-detail-buy" :href="selectedProduct.link" target="_blank" rel="noreferrer">
                {{ selectedProduct.action }}
              </a>

              <button class="product-detail-compare" type="button">
                <span class="compare-icon">⊞</span>
                <span>ADD TO COMPARE</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <main v-else-if="isTvRoute" class="category-page">
        <section class="tv-feature-hero shell">
          <div class="tv-feature-stage">
            <article
              v-for="(slide, index) in tvFeatureSlides"
              :key="slide.title"
              class="tv-feature-slide"
              :class="{ active: index === activeTvFeature }"
            >
              <picture>
                <source media="(max-width: 767px)" :srcset="slide.mobileImage" />
                <img :src="slide.desktopImage" :alt="slide.title" />
              </picture>

              <div class="tv-feature-overlay">
                <div class="tv-feature-copy">
                  <p class="tv-feature-eyebrow">{{ slide.eyebrow }}</p>
                  <h2>{{ slide.title }}</h2>
                  <a class="btn-secondary tv-feature-cta" :href="slide.buttonLink" target="_blank" rel="noreferrer">
                    {{ slide.buttonLabel }}
                  </a>
                  <ul class="tv-feature-notes">
                    <li v-for="note in slide.notes" :key="note">{{ note }}</li>
                  </ul>
                </div>

                <div class="tv-feature-benefits">
                  <div v-for="feature in slide.features" :key="feature.label" class="tv-feature-benefit">
                    <span class="tv-feature-icon" :class="'icon-' + feature.icon"></span>
                    <strong>{{ feature.label }}</strong>
                  </div>
                </div>
              </div>
            </article>

            <button class="tv-feature-arrow left" type="button" aria-label="Previous TV feature" @click="prevTvFeature">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 4L7 12l8 8"></path>
              </svg>
            </button>
            <button class="tv-feature-arrow right" type="button" aria-label="Next TV feature" @click="nextTvFeature">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 4l8 8-8 8"></path>
              </svg>
            </button>

            <div class="tv-feature-dots">
              <button
                v-for="(slide, index) in tvFeatureSlides"
                :key="slide.title + '-dot'"
                type="button"
                :class="{ active: index === activeTvFeature }"
                :aria-label="'Go to feature ' + (index + 1)"
                @click="setTvFeature(index)"
              ></button>
            </div>
          </div>
        </section>

        <section class="tv-page-intro shell">
          <div class="tv-category-strip">
            <button class="tv-category-arrow left" type="button" aria-label="Scroll categories left" @click="scrollTvCategories(-1)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 4L7 12l8 8"></path>
              </svg>
            </button>

            <div ref="tvCategoriesViewport" class="tv-category-viewport">
              <div class="tv-category-track">
                <a
                  v-for="item in tvPageCategories"
                  :key="item.title"
                  :href="item.href"
                  target="_blank"
                  rel="noreferrer"
                  class="tv-category-card"
                  :class="{ 'text-only': !item.image }"
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
                <select id="tv-sort" v-model="tvSortBy">
                  <option>Newest</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              <div class="catalog-results">
                <strong>{{ tvResultCount }}</strong>
                <span>Total Results</span>
                <a href="https://www.lg.com/ae/tvs-soundbars" target="_blank" rel="noreferrer">View All</a>
              </div>
            </div>

            <div class="catalog-grid">
              <article v-for="product in sortedTvPageProducts" :key="product.title + '-catalog'" class="catalog-card">
                <div class="catalog-card-head">
                  <div v-if="getProductTags(product).length" class="catalog-tags">
                    <span v-for="tag in getProductTags(product)" :key="tag" class="catalog-tag">{{ tag }}</span>
                  </div>

                  <div class="catalog-icons">
                    <span>0</span>
                    <button type="button" aria-label="Add to wishlist">
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

                <a class="catalog-media" href="#" @click.prevent="goToProduct(product)">
                  <img :src="product.image" :alt="product.title" />
                </a>

                <h3><a href="#" @click.prevent="goToProduct(product)">{{ product.title }}</a></h3>
                <p class="catalog-sku">
                  <span>{{ product.sku }}</span>
                  <span class="catalog-copy">□</span>
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

                <a class="btn-secondary catalog-buy-btn" href="#" @click.prevent="goToProduct(product)">
                  {{ product.action }}
                </a>
              </article>
            </div>
          </div>

          <div class="catalog-main">
            <div class="catalog-toolbar">
              <div class="catalog-sort">
                <label for="tv-sort">Sort By</label>
                <select id="tv-sort" v-model="tvSortBy">
                  <option>Newest</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              <div class="catalog-results">
                <strong>{{ tvResultCount }}</strong>
                <span>Total Results</span>
                <a href="https://www.lg.com/ae/tvs-soundbars" target="_blank" rel="noreferrer">View All</a>
              </div>
            </div>

            <div class="catalog-grid">
              <article v-for="product in sortedTvPageProducts" :key="product.title" class="catalog-card">
                  <div v-if="getProductTags(product).length" class="product-tags">
                    <span v-for="tag in getProductTags(product)" :key="tag" class="product-tag">{{ tag }}</span>
                  </div>
                  <a class="product-media" :href="product.link" target="_blank" rel="noreferrer">
                    <img :src="product.image" :alt="product.title" />
                  </a>
                  <h3><a :href="product.link" target="_blank" rel="noreferrer">{{ product.title }}</a></h3>
                  <div class="product-rating">
                    <div class="rating-stars" :class="{ active: (product.rating || 0) > 0 }">
                      <span v-for="(filled, index) in getRatingStars(product.rating)" :key="index">{{ filled ? "â˜…" : "â˜…" }}</span>
                    </div>
                    <span class="rating-value">{{ (product.rating || 0).toFixed(1) }} ({{ product.reviews || 0 }})</span>
                  </div>
                  <div class="product-actions">
                    <a class="btn-secondary product-buy-btn" :href="product.link" target="_blank" rel="noreferrer">{{ product.action }}</a>
                    <button class="compare-btn" type="button">
                      <span class="compare-icon">⊞</span>
                      <span>ADD TO COMPARE</span>
                    </button>
                  </div>
                </article>
              </div>
            </div>
            <button class="product-arrow right" type="button" aria-label="Scroll products right" @click="scrollTvProducts(1)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 4l8 8-8 8"></path>
              </svg>
            </button>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <div class="shell footer-top">
          <div class="footer-brand">
            <img src="/telionix-logo.png" alt="Telionix" />
            <p>Gulf, English</p>
            <span>Afghanistan, Armenia, Azerbaijan, Bahrain, Georgia, Kuwait, Oman, Pakistan, Qatar, U.A.E, Yemen</span>
          </div>
          <div class="footer-columns">
            <div v-for="column in footerColumns" :key="column.title" class="footer-column">
              <h3>{{ column.title }}</h3>
              <a v-for="link in column.links" :key="link.label" :href="link.href" target="_blank" rel="noreferrer">{{ link.label }}</a>
            </div>
          </div>
        </div>
        <div class="shell footer-bottom">
          <div class="legal-links">
            <a v-for="link in legalLinks" :key="link.label" :href="link.href" target="_blank" rel="noreferrer">{{ link.label }}</a>
          </div>
          <p class="copyright">Copyright © 2009-2025 LG Electronics. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  `,
};
