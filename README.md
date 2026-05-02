# Telionix

Telionix is a Vue 3 + Vite storefront with a custom Express/MySQL content management panel.

## Stack

- Frontend: Vue 3, Vite
- Admin panel: Express, Multer, MySQL
- Content types: categories, header slides, banners, box banners, products, support content

## Project Structure

- `src/`: storefront pages and app logic
- `admin/`: admin panel, API server, database schema, uploads
- `scripts/dev.mjs`: local development runner that starts the admin API and Vite together

## Local Setup

### 1. Install dependencies

```bash
npm install
cd admin && npm install
```

### 2. Configure the admin environment

Copy `admin/.env.example` to `admin/.env` and set real values for:

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

### 3. Create the database

Run the SQL in `admin/database/schema.sql` against your MySQL server.

### 4. Start the project

From the repository root:

```bash
npm run dev
```

This starts:

- Admin/API server on `http://127.0.0.1:4300`
- Frontend on the Vite development server

## Production Build

```bash
npm run build
```

## Notes

- The storefront reads public content from the admin API under `/api/public/*`.
- Uploaded files are stored under `admin/uploads/` and are ignored by Git.
- Change all admin credentials and session secrets before any public deployment.