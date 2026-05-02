import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "uploads");

loadEnvFile(path.join(__dirname, ".env"));

const config = {
  port: Number(process.env.ADMIN_PORT || 4300),
  auth: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "change-this-admin-password",
    fullName: process.env.ADMIN_FULL_NAME || "Administrator",
    secret: process.env.ADMIN_SESSION_SECRET || "change-this-session-secret",
    sessionHours: Number(process.env.ADMIN_SESSION_HOURS || 12),
  },
  db: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "telionix_admin",
  },
};

const defaultSupportContent = {
  hero: {
    title: "Support",
    subtitle: "Welcome to LG Customer Care Team! How can we help you?",
    image: "https://www.lg.com/ae/images/refrigerators/md07565517/350.jpg",
    findModelText: "Find my model #?",
    signInNote: "Please Sign in to select a registered model.",
  },
  notice: {
    label: "NOTICE",
    text: "Notice of termination of the services of Gracenote Music ID / Video ID/ eyeQ EPG for Blu-ray Player/ Blu-ray Home Theater System will no longer be available.",
    date: "11/10/2024",
  },
  helpCards: [
    { title: "Product Registration", description: "Get the most out of your Telionix product by registering it.", href: "#/support" },
    { title: "Manuals", description: "Download product manuals and other important product documents.", href: "#/support" },
    { title: "Software & Firmware", description: "Find the latest software and firmware for your product.", href: "#/support" },
    { title: "Help Library", description: "Find helpful information about your product.", href: "#/support" },
    { title: "Video Tutorials", description: "Find helpful videos about your product.", href: "#/support" },
    { title: "Warranty", description: "View warranty information and support coverage details.", href: "#/support" },
  ],
  promoCards: [
    { title: "24Hr Repair", subtitle: "Service", image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-1-d.jpg", href: "#/support" },
    { title: "Sunday Repair", subtitle: "service", image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-4-d.jpg", href: "#/support" },
    { title: "Find a Service Center", subtitle: "Find your nearest LG repair service center", image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-2-d.jpg", href: "#/support" },
    { title: "LG Evening Care", subtitle: "service", image: "https://www.lg.com/ae/images/plp-b2c/b2c-2/ae-home-block-3-d.jpg", href: "#/support" },
  ],
  contactMethods: [
    { title: "Telephone", href: "#/support", icon: "phone" },
    { title: "Email", href: "#/support", icon: "mail" },
    { title: "Customer Feedback", href: "#/support", icon: "monitor" },
    { title: "Your Voice to The President", href: "#/support", icon: "user" },
  ],
};

ensureDir(uploadsDir);
ensureDir(path.join(uploadsDir, "headers"));
ensureDir(path.join(uploadsDir, "banners"));
ensureDir(path.join(uploadsDir, "box-banners"));
ensureDir(path.join(uploadsDir, "products"));

const app = express();
const apiRouter = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.get("/telionix-logo.png", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "telionix-logo.png"));
});
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(publicDir));

const pool = await createDatabasePool(config.db);
await ensureAdminUser(pool, config.auth);

const headerUpload = multer({
  storage: createDiskStorage("headers"),
});

const bannerUpload = multer({
  storage: createDiskStorage("banners"),
});

const boxBannerUpload = multer({
  storage: createDiskStorage("box-banners"),
});

const productUpload = multer({
  storage: createDiskStorage("products"),
});

app.get("/api/health", async (_req, res) => {
  const [rows] = await pool.query("SELECT NOW() AS server_time");
  res.json({ ok: true, db: rows[0].server_time });
});

app.get("/api/auth/session", (req, res) => {
  const session = getAuthenticatedSession(req);

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    username: session.username,
  });
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      clearSessionCookie(res);
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await getSingleRecord(
      `SELECT id, username, password_hash, full_name, role, is_active
       FROM users
       WHERE username = ?`,
      [username]
    );

    if (!user || !user.is_active) {
      clearSessionCookie(res);
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const validPassword = verifyPassword(password, user.password_hash);
    if (!validPassword) {
      clearSessionCookie(res);
      return res.status(401).json({ message: "Invalid username or password." });
    }

    setSessionCookie(res, user.username);
    res.json({
      authenticated: true,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/public/products", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.sku, p.title, p.category_id, COALESCE(c.name, p.category) AS category, p.price, p.rating, p.reviews, p.views,
              p.badge_text, p.short_description, p.is_active, p.created_at,
              COALESCE(p.desktop_image, p.image_path) AS desktop_image,
              p.mobile_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC, p.id DESC`
    );
    const galleryMap = await getProductGalleryMap(rows.map((row) => row.id));
    res.json(rows.map((row) => serializePublicProduct(row, req, galleryMap.get(row.id) || [])));
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/header-slides", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, subtitle, cta_label, cta_link, display_order, is_active, created_at,
              desktop_image, mobile_image
       FROM header_slides
       WHERE is_active = 1
       ORDER BY created_at DESC, id DESC
       LIMIT 5`
    );

    res.json(rows.map((row, index) => serializePublicHeaderSlide(row, req, index)));
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/banners", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, subtitle, target_link, display_order, is_active, created_at,
              COALESCE(desktop_image, image_path) AS desktop_image,
              mobile_image
       FROM banners
       WHERE is_active = 1
       ORDER BY display_order ASC, id DESC`
    );

    res.json(rows.map((row) => serializePublicBanner(row, req)));
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/box-banners", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, subtitle, target_link, is_active, created_at,
              desktop_image,
              mobile_image
       FROM box_banners
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT 3`
    );

    res.json(rows.map((row) => serializePublicBoxBanner(row, req)));
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/support-content", async (req, res, next) => {
  try {
    const [settingsRows] = await pool.query(
      `SELECT hero_title, hero_subtitle, hero_image, find_model_text, sign_in_note,
              notice_label, notice_text, notice_date
       FROM support_settings
       ORDER BY id ASC
       LIMIT 1`
    );
    const [helpRows] = await pool.query(
      `SELECT title, description, href
       FROM support_help_cards
       WHERE is_active = 1
       ORDER BY display_order ASC, id ASC`
    );
    const [promoRows] = await pool.query(
      `SELECT title, subtitle, image_path, href
       FROM support_promo_cards
       WHERE is_active = 1
       ORDER BY display_order ASC, id ASC`
    );
    const [boxBannerRows] = await pool.query(
      `SELECT title, subtitle, target_link, desktop_image, mobile_image, created_at
       FROM box_banners
       WHERE is_active = 1
       ORDER BY created_at DESC, id DESC
       LIMIT 3`
    );
    const [contactRows] = await pool.query(
      `SELECT title, href, icon
       FROM support_contact_methods
       WHERE is_active = 1
       ORDER BY display_order ASC, id ASC`
    );
    const [solutionRows] = await pool.query(
      `SELECT category, COALESCE(desktop_image, image_path, mobile_image) AS image_path, created_at
       FROM products
       WHERE is_active = 1 AND category IS NOT NULL AND category <> ''
       ORDER BY created_at DESC, id DESC`
    );

    const settings = settingsRows[0] || {};
    const solutionMap = new Map();
    for (const row of solutionRows) {
      const key = createSlug(row.category);
      if (!key || solutionMap.has(key)) {
        continue;
      }
      solutionMap.set(key, {
        title: row.category,
        image: toAbsolutePublicUrl(req, row.image_path),
      });
    }

    const promoCards = boxBannerRows.length
      ? boxBannerRows.map((row) => ({
          title: row.title || "",
          subtitle: row.subtitle || "",
          image: toAbsolutePublicUrl(req, row.desktop_image) || toAbsolutePublicUrl(req, row.mobile_image),
          href: row.target_link || "#/support",
        }))
      : promoRows.map((row) => ({
          title: row.title || "",
          subtitle: row.subtitle || "",
          image: toAbsolutePublicUrl(req, row.image_path),
          href: row.href || "#/support",
        }));

    res.json({
      hero: {
        title: settings.hero_title || defaultSupportContent.hero.title,
        subtitle: settings.hero_subtitle || defaultSupportContent.hero.subtitle,
        image: toAbsolutePublicUrl(req, settings.hero_image) || defaultSupportContent.hero.image,
        findModelText: settings.find_model_text || defaultSupportContent.hero.findModelText,
        signInNote: settings.sign_in_note || defaultSupportContent.hero.signInNote,
      },
      notice: {
        label: settings.notice_label || defaultSupportContent.notice.label,
        text: settings.notice_text || defaultSupportContent.notice.text,
        date: settings.notice_date || defaultSupportContent.notice.date,
      },
      solutions: Array.from(solutionMap.values()).slice(0, 8),
      helpCards: helpRows.map((row) => ({
        title: row.title || "",
        description: row.description || "",
        href: row.href || "#/support",
      })),
      promoCards,
      contactMethods: contactRows.map((row) => ({
        title: row.title || "",
        href: row.href || "#/support",
        icon: row.icon || "phone",
      })),
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.use((req, res, next) => {
  if (req.path === "/health" || req.path.startsWith("/auth/")) {
    return next();
  }

  const session = getAuthenticatedSession(req);
  if (!session) {
    return res.status(401).json({ message: "Authentication required." });
  }

  req.adminSession = session;
  next();
});

apiRouter.get("/categories", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, slug, description, is_active, created_at
       FROM categories
       ORDER BY name ASC, id DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/categories", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim() || null;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = createSlug(name);
    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, description, is_active)
       VALUES (?, ?, ?, 1)`,
      [name, slug, description]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      description,
      is_active: 1,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "This category already exists." });
    }
    next(error);
  }
});

apiRouter.delete("/categories/:id", async (req, res, next) => {
  try {
    const category = await getSingleRecord(
      "SELECT id FROM categories WHERE id = ?",
      [req.params.id]
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await pool.query("UPDATE products SET category_id = NULL WHERE category_id = ?", [req.params.id]);
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/header-slides", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM header_slides ORDER BY display_order ASC, id DESC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/header-slides",
  headerUpload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const desktopImage = req.files?.desktopImage?.[0];
      const mobileImage = req.files?.mobileImage?.[0];

      if (!desktopImage) {
        return res.status(400).json({ message: "Desktop image is required." });
      }

      const payload = {
        title: req.body.title?.trim() || "Untitled header slide",
        subtitle: req.body.subtitle?.trim() || null,
        ctaLabel: req.body.ctaLabel?.trim() || null,
        ctaLink: req.body.ctaLink?.trim() || null,
        desktopImage: toPublicUploadPath(desktopImage.path),
        mobileImage: mobileImage ? toPublicUploadPath(mobileImage.path) : null,
        displayOrder: Number(req.body.displayOrder || 0),
      };

      const [result] = await pool.query(
        `INSERT INTO header_slides
          (title, subtitle, cta_label, cta_link, desktop_image, mobile_image, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.title,
          payload.subtitle,
          payload.ctaLabel,
          payload.ctaLink,
          payload.desktopImage,
          payload.mobileImage,
          payload.displayOrder,
        ]
      );

      res.status(201).json({ id: result.insertId, ...payload });
    } catch (error) {
      next(error);
    }
  }
);

apiRouter.delete("/header-slides/:id", async (req, res, next) => {
  try {
    const record = await getSingleRecord(
      "SELECT desktop_image, mobile_image FROM header_slides WHERE id = ?",
      [req.params.id]
    );

    if (!record) {
      return res.status(404).json({ message: "Header slide not found." });
    }

    await pool.query("DELETE FROM header_slides WHERE id = ?", [req.params.id]);
    removeFileByPublicPath(record.desktop_image);
    removeFileByPublicPath(record.mobile_image);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/banners", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, subtitle, target_link, display_order, is_active, created_at,
              COALESCE(desktop_image, image_path) AS desktop_image,
              mobile_image
       FROM banners
       ORDER BY display_order ASC, id DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/box-banners", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, subtitle, target_link, is_active, created_at,
              desktop_image,
              mobile_image
       FROM box_banners
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/box-banners",
  boxBannerUpload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const desktopImage = req.files?.desktopImage?.[0];
      const mobileImage = req.files?.mobileImage?.[0];

      if (!desktopImage) {
        return res.status(400).json({ message: "Desktop box banner image is required." });
      }

      const payload = {
        title: req.body.title?.trim() || "Untitled box banner",
        subtitle: req.body.subtitle?.trim() || null,
        targetLink: req.body.targetLink?.trim() || null,
        desktopImage: toPublicUploadPath(desktopImage.path),
        mobileImage: mobileImage ? toPublicUploadPath(mobileImage.path) : null,
      };

      const [result] = await pool.query(
        `INSERT INTO box_banners
          (title, subtitle, target_link, desktop_image, mobile_image)
         VALUES (?, ?, ?, ?, ?)`,
        [
          payload.title,
          payload.subtitle,
          payload.targetLink,
          payload.desktopImage,
          payload.mobileImage,
        ]
      );

      res.status(201).json({ id: result.insertId, ...payload });
    } catch (error) {
      next(error);
    }
  }
);

apiRouter.delete("/box-banners/:id", async (req, res, next) => {
  try {
    const record = await getSingleRecord(
      "SELECT desktop_image, mobile_image FROM box_banners WHERE id = ?",
      [req.params.id]
    );

    if (!record) {
      return res.status(404).json({ message: "Box banner not found." });
    }

    await pool.query("DELETE FROM box_banners WHERE id = ?", [req.params.id]);
    removeFileByPublicPath(record.desktop_image);
    removeFileByPublicPath(record.mobile_image);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/banners",
  bannerUpload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
  try {
      const desktopImage = req.files?.desktopImage?.[0];
      const mobileImage = req.files?.mobileImage?.[0];

      if (!desktopImage) {
        return res.status(400).json({ message: "Desktop banner image is required." });
      }

      const payload = {
        title: req.body.title?.trim() || "Untitled banner",
        subtitle: req.body.subtitle?.trim() || null,
        targetLink: req.body.targetLink?.trim() || null,
        desktopImage: toPublicUploadPath(desktopImage.path),
        mobileImage: mobileImage ? toPublicUploadPath(mobileImage.path) : null,
        displayOrder: Number(req.body.displayOrder || 0),
      };

      const [result] = await pool.query(
        `INSERT INTO banners
          (title, subtitle, target_link, desktop_image, mobile_image, image_path, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.title,
          payload.subtitle,
          payload.targetLink,
          payload.desktopImage,
          payload.mobileImage,
          payload.desktopImage,
          payload.displayOrder,
        ]
      );

      res.status(201).json({ id: result.insertId, ...payload });
    } catch (error) {
      next(error);
    }
  }
);

apiRouter.delete("/banners/:id", async (req, res, next) => {
  try {
    const record = await getSingleRecord(
      "SELECT COALESCE(desktop_image, image_path) AS desktop_image, mobile_image FROM banners WHERE id = ?",
      [req.params.id]
    );

    if (!record) {
      return res.status(404).json({ message: "Banner not found." });
    }

    await pool.query("DELETE FROM banners WHERE id = ?", [req.params.id]);
    removeFileByPublicPath(record.desktop_image);
    removeFileByPublicPath(record.mobile_image);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/products", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.sku, p.title, p.category_id, COALESCE(c.name, p.category) AS category, p.price, p.rating, p.reviews, p.views,
              p.badge_text, p.short_description, p.is_active, p.created_at,
              COALESCE(p.desktop_image, p.image_path) AS desktop_image,
              p.mobile_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC, p.id DESC`
    );
    const galleryMap = await getProductGalleryMap(rows.map((row) => row.id));
    res.json(
      rows.map((row) => ({
        ...row,
        gallery_images: galleryMap.get(row.id) || [],
      }))
    );
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/products",
  productUpload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  async (req, res, next) => {
  try {
      const desktopImage = req.files?.desktopImage?.[0];
      const mobileImage = req.files?.mobileImage?.[0];
      const galleryImages = req.files?.galleryImages || [];

      if (!desktopImage) {
        return res.status(400).json({ message: "Desktop product image is required." });
      }

      const payload = {
        sku: req.body.sku?.trim(),
        title: req.body.title?.trim(),
        categoryId: parseNullableNumber(req.body.categoryId),
        category: req.body.category?.trim(),
        price: parseNullableNumber(req.body.price),
        rating: parseNullableNumber(req.body.rating),
        reviews: Number(req.body.reviews || 0),
        views: Number(req.body.views || 0),
        badgeText: req.body.badgeText?.trim() || null,
        shortDescription: req.body.shortDescription?.trim() || null,
        desktopImage: toPublicUploadPath(desktopImage.path),
        mobileImage: mobileImage ? toPublicUploadPath(mobileImage.path) : null,
        galleryImages: galleryImages.map((file) => toPublicUploadPath(file.path)),
      };

      if (!payload.sku || !payload.title) {
        return res.status(400).json({ message: "SKU and title are required." });
      }

      if (payload.categoryId) {
        const categoryRecord = await getSingleRecord(
          "SELECT id, name FROM categories WHERE id = ?",
          [payload.categoryId]
        );

        if (!categoryRecord) {
          return res.status(400).json({ message: "Selected category does not exist." });
        }

        payload.category = categoryRecord.name;
      }

      if (!payload.category) {
        return res.status(400).json({ message: "Category is required." });
      }

      const connection = await pool.getConnection();

      try {
        await connection.beginTransaction();

        const [result] = await connection.query(
          `INSERT INTO products
            (sku, title, category_id, category, price, rating, reviews, views, badge_text, short_description, desktop_image, mobile_image, image_path)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            payload.sku,
            payload.title,
            payload.categoryId,
            payload.category,
            payload.price,
            payload.rating,
            payload.reviews,
            payload.views,
            payload.badgeText,
            payload.shortDescription,
            payload.desktopImage,
            payload.mobileImage,
            payload.desktopImage,
          ]
        );

        if (payload.galleryImages.length) {
          const galleryValues = payload.galleryImages.map((imagePath, index) => [
            result.insertId,
            imagePath,
            index,
          ]);

          await connection.query(
            `INSERT INTO product_gallery_images (product_id, image_path, display_order)
             VALUES ?`,
            [galleryValues]
          );
        }

        await connection.commit();
        res.status(201).json({ id: result.insertId, ...payload, gallery_images: payload.galleryImages });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "This SKU already exists." });
      }
      next(error);
    }
  }
);

apiRouter.delete("/products/:id", async (req, res, next) => {
  try {
    const record = await getSingleRecord(
      "SELECT id, COALESCE(desktop_image, image_path) AS desktop_image, mobile_image FROM products WHERE id = ?",
      [req.params.id]
    );

    if (!record) {
      return res.status(404).json({ message: "Product not found." });
    }

    const galleryImages = await getGalleryImagesForProduct(record.id);
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    await pool.query("DELETE FROM product_gallery_images WHERE product_id = ?", [req.params.id]);
    removeFileByPublicPath(record.desktop_image);
    removeFileByPublicPath(record.mobile_image);
    galleryImages.forEach((imagePath) => removeFileByPublicPath(imagePath));

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use("/api", apiRouter);

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: error.message || "Unexpected server error.",
  });
});

app.listen(config.port, () => {
  console.log(`Telionix admin panel running on http://localhost:${config.port}`);
});

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function createDiskStorage(folderName) {
  return multer.diskStorage({
    destination(_req, _file, callback) {
      callback(null, path.join(uploadsDir, folderName));
    },
    filename(_req, file, callback) {
      const timestamp = Date.now();
      const safeBase = file.originalname
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "file";
      const extension = path.extname(file.originalname).toLowerCase() || ".bin";
      callback(null, `${timestamp}-${safeBase}${extension}`);
    },
  });
}

async function createDatabasePool(dbConfig) {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();

  const poolInstance = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(160) NOT NULL,
      slug VARCHAR(180) NOT NULL,
      description TEXT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_categories_name (name),
      UNIQUE KEY uq_categories_slug (slug)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(120) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(180) NULL,
      role VARCHAR(60) NOT NULL DEFAULT 'admin',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_users_username (username)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS header_slides (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NULL,
      cta_label VARCHAR(120) NULL,
      cta_link VARCHAR(500) NULL,
      desktop_image VARCHAR(500) NOT NULL,
      mobile_image VARCHAR(500) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NULL,
      target_link VARCHAR(500) NULL,
      desktop_image VARCHAR(500) NULL,
      mobile_image VARCHAR(500) NULL,
      image_path VARCHAR(500) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS box_banners (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NULL,
      target_link VARCHAR(500) NULL,
      desktop_image VARCHAR(500) NOT NULL,
      mobile_image VARCHAR(500) NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await ensureColumn(poolInstance, dbConfig.database, "banners", "desktop_image", "ALTER TABLE banners ADD COLUMN desktop_image VARCHAR(500) NULL AFTER target_link");
  await ensureColumn(poolInstance, dbConfig.database, "banners", "mobile_image", "ALTER TABLE banners ADD COLUMN mobile_image VARCHAR(500) NULL AFTER desktop_image");
  await ensureColumn(poolInstance, dbConfig.database, "banners", "image_path", "ALTER TABLE banners ADD COLUMN image_path VARCHAR(500) NULL AFTER mobile_image");
  await poolInstance.query("ALTER TABLE banners MODIFY COLUMN image_path VARCHAR(500) NULL");

  await poolInstance.query(`
    UPDATE banners
    SET desktop_image = image_path
    WHERE desktop_image IS NULL AND image_path IS NOT NULL
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      sku VARCHAR(120) NOT NULL,
      title VARCHAR(255) NOT NULL,
      category_id INT UNSIGNED NULL,
      category VARCHAR(120) NOT NULL,
      price DECIMAL(10,2) NULL,
      rating DECIMAL(3,2) NULL,
      reviews INT NOT NULL DEFAULT 0,
      views INT NOT NULL DEFAULT 0,
      badge_text VARCHAR(120) NULL,
      short_description TEXT NULL,
      desktop_image VARCHAR(500) NULL,
      mobile_image VARCHAR(500) NULL,
      image_path VARCHAR(500) NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_products_sku (sku)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS product_gallery_images (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      product_id INT UNSIGNED NOT NULL,
      image_path VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_product_gallery_product (product_id)
    )
  `);

  await ensureColumn(poolInstance, dbConfig.database, "products", "category_id", "ALTER TABLE products ADD COLUMN category_id INT UNSIGNED NULL AFTER title");
  await ensureColumn(poolInstance, dbConfig.database, "products", "desktop_image", "ALTER TABLE products ADD COLUMN desktop_image VARCHAR(500) NULL AFTER short_description");
  await ensureColumn(poolInstance, dbConfig.database, "products", "mobile_image", "ALTER TABLE products ADD COLUMN mobile_image VARCHAR(500) NULL AFTER desktop_image");
  await ensureColumn(poolInstance, dbConfig.database, "products", "image_path", "ALTER TABLE products ADD COLUMN image_path VARCHAR(500) NULL AFTER mobile_image");
  await ensureColumn(poolInstance, dbConfig.database, "products", "views", "ALTER TABLE products ADD COLUMN views INT NOT NULL DEFAULT 0 AFTER reviews");
  await poolInstance.query("ALTER TABLE products MODIFY COLUMN image_path VARCHAR(500) NULL");

  await poolInstance.query(`
    UPDATE products
    SET desktop_image = image_path
    WHERE desktop_image IS NULL AND image_path IS NOT NULL
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS support_settings (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      hero_title VARCHAR(255) NOT NULL,
      hero_subtitle TEXT NULL,
      hero_image VARCHAR(500) NULL,
      find_model_text VARCHAR(255) NULL,
      sign_in_note TEXT NULL,
      notice_label VARCHAR(120) NULL,
      notice_text TEXT NULL,
      notice_date VARCHAR(60) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS support_help_cards (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      href VARCHAR(500) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS support_promo_cards (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NULL,
      image_path VARCHAR(500) NULL,
      href VARCHAR(500) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS support_contact_methods (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      href VARCHAR(500) NULL,
      icon VARCHAR(80) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await seedSupportDefaults(poolInstance);

  return poolInstance;
}

function toPublicUploadPath(filePath) {
  return `/${path.relative(__dirname, filePath).replace(/\\/g, "/")}`;
}

function serializePublicProduct(row, req, galleryImages = []) {
  const desktopImage = toAbsolutePublicUrl(req, row.desktop_image);
  const mobileImage = toAbsolutePublicUrl(req, row.mobile_image) || desktopImage;
  const detailGallery = Array.from(
    new Set([desktopImage, mobileImage, ...galleryImages.map((imagePath) => toAbsolutePublicUrl(req, imagePath))].filter(Boolean))
  );
  const detailBullets = buildProductHighlights(row);

  return {
    id: row.id,
    sku: row.sku,
    title: row.title,
    category: row.category,
    price: row.price === null ? null : Number(row.price),
    rating: row.rating === null ? 0 : Number(row.rating),
    reviews: Number(row.reviews || 0),
    views: Number(row.views || 0),
    badge: row.badge_text || "",
    tags: row.badge_text ? [row.badge_text] : [],
    shortDescription: row.short_description || "",
    image: desktopImage,
    desktopImage,
    mobileImage,
    bullets: detailBullets.slice(0, 3),
    detailBullets,
    detailGallery,
    action: "View Details",
    link: null,
    createdAt: row.created_at,
  };
}

async function getProductGalleryMap(productIds) {
  const ids = productIds.filter(Boolean);
  if (!ids.length) {
    return new Map();
  }

  const [rows] = await pool.query(
    `SELECT product_id, image_path
     FROM product_gallery_images
     WHERE product_id IN (?)
     ORDER BY display_order ASC, id ASC`,
    [ids]
  );

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.product_id)) {
      map.set(row.product_id, []);
    }
    map.get(row.product_id).push(row.image_path);
  }

  return map;
}

async function getGalleryImagesForProduct(productId) {
  const [rows] = await pool.query(
    `SELECT image_path
     FROM product_gallery_images
     WHERE product_id = ?
     ORDER BY display_order ASC, id ASC`,
    [productId]
  );

  return rows.map((row) => row.image_path).filter(Boolean);
}

function serializePublicHeaderSlide(row, req, index) {
  const title = String(row.title || "").trim();
  const ctaLabel = String(row.cta_label || "").trim();

  return {
    id: row.id || `slide-${index + 1}`,
    title: title.toLowerCase() === "untitled header slide" ? "" : title,
    copy: row.subtitle || "",
    desktopImage: toAbsolutePublicUrl(req, row.desktop_image),
    mobileImage: toAbsolutePublicUrl(req, row.mobile_image) || toAbsolutePublicUrl(req, row.desktop_image),
    ctaLabel: ctaLabel.toLowerCase() === "learn more" ? "" : ctaLabel,
    ctaLink: row.cta_link || "#",
    theme: index % 2 === 0 ? "dark" : "light",
    align: "left middle",
    displayOrder: Number(row.display_order || 0),
    createdAt: row.created_at,
  };
}

function serializePublicBanner(row, req) {
  return {
    id: row.id,
    title: row.title || "",
    subtitle: row.subtitle || "",
    desktopImage: toAbsolutePublicUrl(req, row.desktop_image),
    mobileImage: toAbsolutePublicUrl(req, row.mobile_image) || toAbsolutePublicUrl(req, row.desktop_image),
    ctaLabel: row.title || "Learn More",
    ctaLink: row.target_link || "#",
    displayOrder: Number(row.display_order || 0),
    createdAt: row.created_at,
  };
}

function serializePublicBoxBanner(row, req) {
  return {
    id: row.id,
    title: row.title || "",
    subtitle: row.subtitle || "",
    image: toAbsolutePublicUrl(req, row.desktop_image),
    desktopImage: toAbsolutePublicUrl(req, row.desktop_image),
    mobileImage: toAbsolutePublicUrl(req, row.mobile_image) || toAbsolutePublicUrl(req, row.desktop_image),
    link: row.target_link || "#",
    createdAt: row.created_at,
  };
}

function toAbsolutePublicUrl(req, publicPath) {
  if (!publicPath) {
    return "";
  }

  if (/^https?:\/\//i.test(publicPath)) {
    return publicPath;
  }

  return new URL(publicPath, `${req.protocol}://${req.get("host")}`).toString();
}

function buildProductHighlights(row) {
  const descriptionParts = String(row.short_description || "")
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const highlights = [];

  for (const item of descriptionParts) {
    if (!highlights.includes(item)) {
      highlights.push(item);
    }
  }

  if (!highlights.length && row.category) {
    highlights.push(`Category: ${row.category}`);
  }

  if (!highlights.length) {
    highlights.push("Product information will be updated soon.");
  }

  if (row.sku && !highlights.some((item) => item.includes(row.sku))) {
    highlights.push(`SKU: ${row.sku}`);
  }

  if (row.rating !== null && row.rating !== undefined) {
    highlights.push(`Customer rating: ${Number(row.rating).toFixed(1)} out of 5`);
  }

  if (row.reviews) {
    highlights.push(`Reviews: ${Number(row.reviews)}`);
  }

  if (row.views) {
    highlights.push(`Views: ${Number(row.views)}`);
  }

  return highlights;
}

async function seedSupportDefaults(poolInstance) {
  const [settingsRows] = await poolInstance.query("SELECT id FROM support_settings LIMIT 1");
  if (!settingsRows.length) {
    await poolInstance.query(
      `INSERT INTO support_settings
        (hero_title, hero_subtitle, hero_image, find_model_text, sign_in_note, notice_label, notice_text, notice_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        defaultSupportContent.hero.title,
        defaultSupportContent.hero.subtitle,
        defaultSupportContent.hero.image,
        defaultSupportContent.hero.findModelText,
        defaultSupportContent.hero.signInNote,
        defaultSupportContent.notice.label,
        defaultSupportContent.notice.text,
        defaultSupportContent.notice.date,
      ]
    );
  }

  const [helpRows] = await poolInstance.query("SELECT id FROM support_help_cards LIMIT 1");
  if (!helpRows.length) {
    const values = defaultSupportContent.helpCards.map((item, index) => [
      item.title,
      item.description,
      item.href,
      index,
      1,
    ]);
    await poolInstance.query(
      `INSERT INTO support_help_cards (title, description, href, display_order, is_active)
       VALUES ?`,
      [values]
    );
  }

  const [promoRows] = await poolInstance.query("SELECT id FROM support_promo_cards LIMIT 1");
  if (!promoRows.length) {
    const values = defaultSupportContent.promoCards.map((item, index) => [
      item.title,
      item.subtitle,
      item.image,
      item.href,
      index,
      1,
    ]);
    await poolInstance.query(
      `INSERT INTO support_promo_cards (title, subtitle, image_path, href, display_order, is_active)
       VALUES ?`,
      [values]
    );
  }

  const [contactRows] = await poolInstance.query("SELECT id FROM support_contact_methods LIMIT 1");
  if (!contactRows.length) {
    const values = defaultSupportContent.contactMethods.map((item, index) => [
      item.title,
      item.href,
      item.icon,
      index,
      1,
    ]);
    await poolInstance.query(
      `INSERT INTO support_contact_methods (title, href, icon, display_order, is_active)
       VALUES ?`,
      [values]
    );
  }
}

function removeFileByPublicPath(publicPath) {
  if (!publicPath) {
    return;
  }

  const resolvedPath = path.join(__dirname, publicPath.replace(/^\//, ""));
  if (fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath);
  }
}

async function getSingleRecord(query, values) {
  const [rows] = await pool.query(query, values);
  return rows[0] || null;
}

function parseNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

async function ensureColumn(poolInstance, database, table, column, alterQuery) {
  const [rows] = await poolInstance.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [database, table, column]
  );

  if (!rows[0]?.count) {
    await poolInstance.query(alterQuery);
  }
}

async function ensureAdminUser(poolInstance, authConfig) {
  const existingUser = await getSingleRecord(
    "SELECT id, username, password_hash, full_name FROM users WHERE username = ?",
    [authConfig.username]
  );

  const passwordHash = hashPassword(authConfig.password);

  if (!existingUser) {
    await poolInstance.query(
      `INSERT INTO users (username, password_hash, full_name, role, is_active)
       VALUES (?, ?, ?, 'admin', 1)`,
      [authConfig.username, passwordHash, authConfig.fullName]
    );
    return;
  }

  await poolInstance.query(
    `UPDATE users
     SET password_hash = COALESCE(password_hash, ?),
         full_name = COALESCE(full_name, ?),
         is_active = 1
     WHERE id = ?`,
    [passwordHash, authConfig.fullName, existingUser.id]
  );
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 120000;
  const digest = "sha512";
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, digest).toString("hex");
  return `pbkdf2$${digest}$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith("pbkdf2$")) {
    return false;
  }

  const match = storedHash.match(/^pbkdf2\$(.+?)\$(\d+)\$(.+?)\$(.+)$/);
  if (!match) {
    return false;
  }

  const [, digest, iterationsRaw, salt, expectedHash] = match;
  if (!digest || !iterationsRaw || !salt || !expectedHash) {
    return false;
  }

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const derivedHash = crypto.pbkdf2Sync(password, salt, iterations, 64, digest).toString("hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (derivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedBuffer, expectedBuffer);
}

function getAuthenticatedSession(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.admin_session;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

function setSessionCookie(res, username) {
  const maxAge = Math.max(1, Math.floor(config.auth.sessionHours * 60 * 60));
  const expiresAt = Date.now() + maxAge * 1000;
  const token = createSessionToken(username, expiresAt);
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  appendSetCookie(
    res,
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`
  );
}

function clearSessionCookie(res) {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  appendSetCookie(
    res,
    `admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`
  );
}

function appendSetCookie(res, cookieValue) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookieValue);
    return;
  }

  if (Array.isArray(current)) {
    res.setHeader("Set-Cookie", [...current, cookieValue]);
    return;
  }

  res.setHeader("Set-Cookie", [current, cookieValue]);
}

function createSessionToken(username, expiresAt) {
  const payload = `${username}|${expiresAt}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}|${signature}`, "utf8").toString("base64url");
}

function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");

    if (parts.length !== 3) {
      return null;
    }

    const [username, expiresAtRaw, signature] = parts;
    const payload = `${username}|${expiresAtRaw}`;
    const expected = signPayload(payload);
    const expiresAt = Number(expiresAtRaw);

    if (!username || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      return null;
    }

    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      return null;
    }

    return { username, expiresAt };
  } catch {
    return null;
  }
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", config.auth.secret)
    .update(payload)
    .digest("hex");
}

function parseCookies(cookieHeader) {
  const cookies = {};

  for (const chunk of cookieHeader.split(";")) {
    const [rawName, ...rest] = chunk.trim().split("=");
    if (!rawName) {
      continue;
    }
    cookies[rawName] = rest.join("=");
  }

  return cookies;
}
