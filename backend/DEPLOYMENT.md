# Backend Deployment Guide - Step by Step

## Overview
This guide will help you deploy the FlipCut backend to a live URL. We'll use **Railway** (recommended for beginners) or **Render** as deployment platforms.

---

## STEP 1: Prepare Your Backend for Deployment ✅

### What We've Done:
- ✅ Added Node.js engine requirements to `package.json`
- ✅ Verified build scripts are properly configured

### What You Need:
1. **MongoDB Atlas Account** (free tier available) - [Get it here](https://www.mongodb.com/cloud/atlas/register)
2. **Railway Account** (or Render) - [Get Railway here](https://railway.app/) or [Get Render here](https://render.com/)
3. Your existing **Cloudinary** and **remove.bg API keys**

### Next Steps:
1. Make sure your code is committed to Git (we'll push to GitHub)
2. Have all your environment variables ready (we'll set them in Step 2)

---

## STEP 2: Set Up MongoDB Atlas (Cloud Database)

### Why MongoDB Atlas?
Your local MongoDB won't be accessible online. MongoDB Atlas provides a free cloud database.

### Instructions:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up
2. Create a new **FREE** cluster (M0 Sandbox)
3. Wait 3-5 minutes for the cluster to be created
4. Click **"Connect"** button
5. Choose **"Connect your application"**
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your actual database password
8. Add `?retryWrites=true&w=majority` at the end (if not already there)
9. **SAVE THIS CONNECTION STRING** - you'll need it in the next step!

### Database Access Setup:
- In Atlas, go to **Database Access** (left sidebar)
- Add a new database user with username and password
- Save the credentials securely

### Network Access Setup:
- Go to **Network Access** (left sidebar)
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0) for now
- This allows your deployed backend to connect

---

## STEP 3: Deploy to Railway

### 3.1: Create Railway Account
1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub (recommended) or email
3. Verify your email if required

### 3.2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. If your code isn't on GitHub yet:
   - Go to GitHub.com
   - Create a new repository (e.g., "FlipCut")
   - Push your code there
   - Then come back to Railway and connect it

### 3.3: Configure Deployment
1. Railway will auto-detect your backend folder
2. If it doesn't, click on your project → **Settings** → **Root Directory** → Set to `backend`
3. Railway will automatically:
   - Detect Node.js
   - Run `npm install`
   - Run `npm run build` (we have this script)
   - Run `npm start` to start the server

### 3.4: Set Environment Variables
1. In Railway project, go to **Variables** tab
2. Add these environment variables one by one:

```
NODE_ENV=production
PORT=8000

MONGO_URL=your_mongodb_atlas_connection_string_here
DB_NAME=flipcut

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REMOVEBG_API_KEY=your_removebg_api_key

CORS_ORIGINS=*
```
**Important Notes:**
- Replace all `your_*` values with actual values
- For `CORS_ORIGINS`, use `*` for now (we'll update this with your frontend URL later)
- For `MONGO_URL`, use the connection string from Step 2 (including password)

### 3.5: Generate Public URL
1. Go to **Settings** tab in Railway
2. Scroll to **"Generate Domain"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://your-app.up.railway.app`
5. **COPY THIS URL** - This is your backend API URL! 🎉

### 3.6: Verify Deployment
1. Railway will automatically redeploy when you save environment variables
2. Wait for deployment to finish (green checkmark)
3. Test your backend:
   - Visit: `https://your-app.up.railway.app/api/health`
   - You should see: `{"status":"healthy"}`
   - Visit: `https://your-app.up.railway.app/api`
   - You should see API info

---

## Alternative: Deploy to Render

If you prefer Render instead of Railway:

### 1. Create Render Account
- Go to [render.com](https://render.com/)
- Sign up with GitHub

### 2. Create New Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository
- Configure:
  - **Name**: `flipcut-backend`
  - **Root Directory**: `backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`

### 3. Set Environment Variables
Same as Railway (Step 3.4 above)

### 4. Deploy
- Click **"Create Web Service"**
- Render will build and deploy
- Get your URL from the dashboard (e.g., `https://flipcut-backend.onrender.com`)

---

## Troubleshooting

### Build Fails
- Check Railway/Render logs
- Ensure TypeScript compiles: `npm run build` works locally
- Check Node.js version (should be 18+)

### Server Won't Start
- Check environment variables are all set
- Verify MongoDB connection string is correct
- Check PORT variable (Railway sets this automatically, don't override)

### Database Connection Fails
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check username/password in connection string
- Ensure cluster is running (not paused)

### CORS Errors
- Update `CORS_ORIGINS` with your frontend URL once deployed
- Use comma-separated list: `https://your-frontend.com,https://www.your-frontend.com`

---

## Next Steps

Once your backend is deployed and working:
1. ✅ Save your backend URL (you'll need it for frontend deployment)
2. ✅ Test all endpoints work correctly
3. ✅ Update CORS_ORIGINS with your frontend URL (after frontend is deployed)
4. → **Proceed to Frontend Deployment** (we'll cover this next)

---

## Support

If you encounter issues:
- Check Railway/Render deployment logs
- Verify all environment variables are set correctly
- Ensure your local build works: `npm run build && npm start`
