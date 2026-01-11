# Frontend Deployment Guide - Step by Step

## Overview
This guide will help you deploy the FlipCut React frontend to a live URL. We'll use **Vercel** (recommended for React apps - free and optimized) or **Netlify** as deployment platforms.

---

## STEP 1: Prepare Frontend for Deployment ✅

### What We Need:
1. **Backend URL**: `https://flipcut-production.up.railway.app` (already deployed! ✅)
2. **Vercel Account** (free) - [Get it here](https://vercel.com/signup) or [Netlify](https://app.netlify.com/signup)
3. **GitHub repository** (already has your code! ✅)

### Environment Variable Needed:
- `REACT_APP_BACKEND_URL` = `https://flipcut-production.up.railway.app`

### Next Steps:
1. Test build locally (optional but recommended)
2. Deploy to Vercel/Netlify
3. Set environment variable
4. Get your live frontend URL!

---

## STEP 2: Deploy to Vercel (Recommended)

Vercel is the easiest and best option for React apps - it's free, fast, and optimized for Create React App.

### 2.1: Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended - easiest way)
4. Authorize Vercel to access your GitHub account
5. You'll be redirected to Vercel dashboard

### 2.2: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"FlipCut"** repository and click **"Import"**
4. Vercel will detect your project structure...

### 2.3: Configure Project Settings

Vercel should auto-detect React, but configure these settings:

1. **Project Name**: `flipcut-frontend` (or any name you like)
2. **Root Directory**: Click **"Edit"** and set to: **`frontend`**
3. **Framework Preset**: Should auto-detect as "Create React App"
4. **Build Command**: Should auto-detect as `npm run build`
5. **Output Directory**: Should auto-detect as `build`
6. **Install Command**: Should auto-detect as `npm install`

### 2.4: Set Environment Variable

**BEFORE CLICKING "DEPLOY"**, add the environment variable:

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** or **"Add Another"**
3. Add this variable:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://flipcut-production.up.railway.app`
   - **Environment**: Select **"Production"** (and "Preview" if you want)
4. Click **"Save"**

### 2.5: Deploy!

1. Click the big **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy to a CDN
3. Wait 2-3 minutes for deployment to complete
4. ✅ Your frontend is live!

### 2.6: Get Your Frontend URL

1. Once deployment completes, Vercel will show:
   - **Production URL**: `https://your-app.vercel.app`
   - **Preview URLs**: For each branch/deployment
2. **COPY YOUR PRODUCTION URL** - This is your live frontend! 🎉

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

### 1. Create Netlify Account
- Go to [netlify.com](https://app.netlify.com/signup)
- Sign up with GitHub

### 2. Create New Site
- Click **"Add new site"** → **"Import an existing project"**
- Choose **"Deploy with GitHub"**
- Select **"FlipCut"** repository

### 3. Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/build`

### 4. Set Environment Variable
- Go to **Site settings** → **Environment variables**
- Add: `REACT_APP_BACKEND_URL` = `https://flipcut-production.up.railway.app`

### 5. Deploy
- Click **"Deploy site"**
- Get your URL: `https://your-app.netlify.app`

---

## STEP 3: Update Backend CORS (Important!)

After getting your frontend URL, update the backend CORS settings:

### On Railway:

1. Go to your Railway project
2. Click on your backend service
3. Go to **"Variables"** tab
4. Find `CORS_ORIGINS` variable
5. Update it to your frontend URL (or keep `*` for now):
   - Example: `https://your-app.vercel.app`
   - Or use `*` to allow all origins (less secure but works for now)

---

## STEP 4: Test Your Deployment

### Test Frontend:
1. Visit your frontend URL (e.g., `https://your-app.vercel.app`)
2. Check if the page loads correctly
3. Open browser console (F12) → Check for errors
4. Look for any CORS errors (if you see them, update CORS_ORIGINS)

### Test Backend Connection:
1. The frontend should connect to your backend automatically
2. Try logging in or using features that call the API
3. Check browser Network tab to see API calls

---

## Troubleshooting

### Build Fails
- Check Vercel/Netlify build logs
- Verify `npm run build` works locally
- Check for TypeScript/ESLint errors

### Frontend Can't Connect to Backend
- Verify `REACT_APP_BACKEND_URL` is set correctly
- Check backend URL is accessible: `https://flipcut-production.up.railway.app/api/health`
- Check browser console for CORS errors
- Update backend `CORS_ORIGINS` with frontend URL

### CORS Errors
- Update backend `CORS_ORIGINS` on Railway
- Make sure frontend URL is in the allowed origins list
- Redeploy backend after updating CORS

---

## Quick Reference

### Your URLs:
- **Backend**: `https://flipcut-production.up.railway.app`
- **Frontend**: `https://your-app.vercel.app` (you'll get this after deployment)

### Environment Variable:
```
REACT_APP_BACKEND_URL=https://flipcut-production.up.railway.app
```

---

## Next Steps After Deployment

1. ✅ Test your frontend URL works
2. ✅ Update backend CORS_ORIGINS with frontend URL
3. ✅ Test full integration (frontend ↔ backend)
4. ✅ Share your live app! 🚀

---

## Support

If you encounter issues:
- Check Vercel/Netlify deployment logs
- Verify environment variable is set correctly
- Test backend URL directly in browser
- Check browser console for errors
