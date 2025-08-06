# Copilot Instructions for E-borrow-System

## Project Architecture
- **Monorepo Structure:**
  - `Frontend/`: React + Vite app for user/admin/executive interfaces. Entry: `src/main.jsx`, main layout: `src/App.jsx`.
  - `server/`: Node.js backend (Express style), entry: `index.js`. Handles REST APIs, database, and file uploads.
- **Data Flow:**
  - Frontend communicates with backend via REST API endpoints (see `src/utils/api.js`).
  - Real-time features use sockets (`src/hooks/useSocket.js`, `src/utils/socketService.js`).
  - Backend interacts with a database (see SQL migration files in `server/database/`).

## Developer Workflows
- **Start Development:**
  - Frontend: `npm run dev` in `Frontend/` (or VS Code task: Start Frontend)
  - Backend: `node index.js` in `server/` (or VS Code task: Start Backend)
- **Database Migrations:**
  - SQL scripts in `server/database/` (e.g., `add_handover_photo.sql`) are run manually against the DB.
- **Linting:**
  - ESLint config in `Frontend/eslint.config.js`. Run with `npx eslint src/`.

## Key Patterns & Conventions
- **Frontend:**
  - Components organized by role (`src/components/SidebarAdmin.jsx`, etc.) and feature.
  - Dialogs and modals in `src/components/dialog/`.
  - Page-level components in `src/pages/{admin,executive,users}/`.
  - Use hooks for sockets and shared logic.
- **Backend:**
  - Controllers in `server/controllers/` handle business logic per resource.
  - Models in `server/models/` map to DB tables.
  - Routes in `server/routes/` define API endpoints, grouped by resource.
  - Middleware in `server/middleware/` for auth and request handling.
  - File uploads stored in `server/uploads/` (subfolders by type).

## Integration Points
- **External:**
  - LINE Notify integration (`server/utils/lineNotify.js`).
  - Email utilities (`server/utils/emailUtils.js`).
- **Internal:**
  - Frontend API calls use `src/utils/api.js` for endpoint definitions.
  - Socket events managed via `src/hooks/useSocket.js` and backend socket logic.

## Database Structure

The backend database (see `server/database/e-borrow.sql`) uses normalized tables to manage borrowing workflows. Key tables and columns:

- **borrow_transactions**: `borrow_id`, `user_id`, `borrow_date`, `return_date`, `status`, `created_at`, `updated_at`, `borrow_code`, `purpose`, `rejection_reason`, `signature_image`, `handover_photo`, `important_documents`
- **borrow_items**: `borrow_item_id`, `borrow_id`, `item_id`, `quantity`
- **branches**: `branch_id`, `branch_name`
- **category**: `category_id`, `category_code`, `name`, `created_at`, `updated_at`
- **damage_levels**: `damage_id`, `name`, `fine_percent`, `detail`
- **equipment**: `item_id`, `name`, `category`, `description`, `quantity`, `unit`, `status`, `pic`, `created_at`, `pic_filename`, `item_code`, `price`, `location`, `purchaseDate`, `branch_id`
- **news**: `id`, `title`, `content`, `category`, `date`, `created_at`, `updated_at`
- **positions**: `position_id`, `position_name`
- **repair_requests**: `id`, `user_id`, `item_id`, `problem_description`, `request_date`, `estimated_cost`, `status`, `created_at`, `pic_filename`, `repair_code`, `note`, `budget`, `responsible_person`, `approval_date`
- **returns**: `return_id`, `borrow_id`, `return_date`, `return_by`, `fine_amount`, `proof_image`, `status`, `notes`, `created_at`, `updated_at`, `pay_status`, `payment_method`, `damage_fine`, `late_fine`, `late_days`, `user_id`
- **return_items**: `return_item_id`, `return_id`, `item_id`, `damage_level_id`, `damage_note`, `fine_amount`, `created_at`, `updated_at`
- **roles**: `role_id`, `role_name`
- **users**: `user_id`, `user_code`, `username`, `email`, `password`, `phone`, `avatar`, `role_id`, `position_id`, `branch_id`, `street`, `district`, `province`, `postal_no`, `created_at`, `updated_at`, `Fullname`, `parish`, `line_id`, `line_notify_enabled`

Foreign key relationships link users, equipment, branches, positions, roles, and transactions. File uploads (handover photos, signatures, documents) are referenced by path in transaction records. Status and workflow are managed via the `status` field in `borrow_transactions` and related tables.

Refer to the SQL file for full schema, constraints, and relationships.

## Examples
- To add a new API endpoint: create a controller in `server/controllers/`, model in `server/models/`, and route in `server/routes/`.
- To add a new frontend page: add a component in `src/pages/`, link via sidebar in `src/components/Sidebar*.jsx`.

---
_If any section is unclear or missing important project-specific details, please provide feedback to improve these instructions._
