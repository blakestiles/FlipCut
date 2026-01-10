# FlipCut Deployment Guide

## Backend Deployment to Vercel

### Step 1: Deploy Backend

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repository**: Select `blakestiles/FlipCut`
4. **Configure Project Settings**:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build` (optional, Vercel will auto-detect)
   - **Output Directory**: Leave empty (not needed for serverless)
   - **Install Command**: `npm install`

5. **Add Environment Variables** (in Vercel UI):
   ```
   MONGO_URL=your_mongodb_connection_string
   DB_NAME=flipcut
   CORS_ORIGINS=https://your-frontend-url.vercel.app,*
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REMOVEBG_API_KEY=your_removebg_api_key
   NODE_ENV=production
   PORT=8000
   ```

6. **Click "Deploy"**

7. **Get your Backend URL**: After deployment, copy the deployment URL (e.g., `https://flipcut-backend-xxx.vercel.app`)

### Step 2: Deploy Frontend

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repository**: Select `blakestiles/FlipCut` (same repo, different project)
4. **Configure Project Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install --legacy-peer-deps`

5. **Add Environment Variable**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.vercel.app
   ```
   Replace `https://your-backend-url.vercel.app` with the actual backend URL from Step 1.

6. **Click "Deploy"**

## Alternative: Deploy Backend to Railway/Render (Recommended for file uploads)

If you experience issues with file uploads on Vercel, consider deploying the backend to:

### Railway (Recommended)
1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repo
4. Set Root Directory to `backend`
5. Add all environment variables
6. Railway will auto-detect Node.js and deploy

### Render
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add all environment variables
6. Deploy

## Important Notes

- **CORS_ORIGINS**: Make sure to include your frontend URL in the CORS_ORIGINS environment variable
- **MongoDB**: You'll need a cloud MongoDB instance (MongoDB Atlas is recommended)
- **File Upload Size**: Vercel serverless functions have a 4.5MB request limit. For larger files, consider Railway or Render.
- **Environment Variables**: Never commit `.env` files. Always use Vercel's environment variable settings.
