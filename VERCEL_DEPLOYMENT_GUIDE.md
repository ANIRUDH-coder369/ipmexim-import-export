# 🚀 IPM Exim Global — Vercel Production Deployment Guide

This project is **100% production-ready for instant live deployment on Vercel**.

---

## ⚡ 1-Click Fast Deployment to Vercel

### Step 1: Push Code to GitHub
Ensure all code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Production release: glassmorphism design system & Vercel readiness"
git push origin main
```

---

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your GitHub repository (`import-export` / `ipmexim`).
4. **Vercel Settings Detection**:
   - **Framework Preset**: `Next.js` (Automatically detected).
   - **Root Directory**:
     - If you deploy from root: Keep default `./` (The included root `vercel.json` and root `package.json` handle everything automatically).
     - Or choose `frontend` as Root Directory. Both work out of the box.

---

### Step 3: Add Production Environment Variables in Vercel
In the Vercel project configuration screen, go to **Environment Variables** and add the following keys:

| Key | Example Value | Description |
|---|---|---|
| `ADMIN_EMAIL` | `admin@importexport.com` | Primary administrator login email |
| `ADMIN_PASSWORD` | `Admin@12345` | Secure administrator access key |
| `ADMIN_NAME` | `Super Admin` | Display name in executive header |
| `NOTIFICATION_EMAIL` | `ipmexim@gmail.com` | Destination inbox for new quotations |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP Mail Server |
| `SMTP_PORT` | `587` | SMTP Port |
| `SMTP_USER` | `kotambeharsh@gmail.com` | Official Gmail dispatch user |
| `SMTP_PASS` | `zytscfewkjyclptj` | Gmail App Password |
| `EMAIL_FROM` | `"IPM Exim" <kotambeharsh@gmail.com>` | Official sender header |
| `NEXT_PUBLIC_API_URL` | *(Optional)* | Leave blank to use built-in serverless `/api` routes! Or set to external Express URL if hosted separately. |

---

### Step 4: Click "Deploy"
Vercel will build and deploy the Next.js application to global edge CDN in under 60 seconds with SSL enabled (`https://your-domain.vercel.app`).

---

## 🛡️ Production Architectural Highlights

1. **Dual Execution Runtime**:
   - **Standalone Serverless Mode (Vercel)**: Next.js API routes (`/api/enquiries`, `/api/product-lines`, `/api/admin/login`, `/api/health`) allow the website to operate 100% autonomously on Vercel without requiring a separate server.
   - **External Backend Mode**: If you host the Node.js/Express server on Railway, Render, or Fly.io, simply set `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`.
2. **Glassmorphism Design System**:
   - Sapphire and cyan glow buttons with frosted backdrop blur, specular top reflection, and smooth hover elevation.
3. **Admin Security Gate**:
   - Server-side Next.js middleware protection (`frontend/middleware.ts`) enforcing authenticated cookie sessions before granting dashboard access.
4. **Automated Dual Email Dispatch with Brand Logo**:
   - Instant buyer confirmation with exact form parameters.
   - Instant trade desk notification dispatched to `ipmexim@gmail.com` with inline CID logo.
