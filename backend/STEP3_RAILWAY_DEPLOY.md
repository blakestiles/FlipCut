# STEP 3: Deploy Backend to Railway

## Prerequisites Checklist
Before starting, make sure you have:
- ✅ Complete MongoDB connection string (with password)
- ✅ MongoDB Atlas network access set to `0.0.0.0/0`
- ✅ Railway account (or ready to create one)
- ✅ GitHub repository with your code pushed (already done! ✅)

---

## 3.1: Create Railway Account

1. Go to **https://railway.app/**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"** (recommended - easiest way)
4. Authorize Railway to access your GitHub account
5. You'll be redirected to Railway dashboard

---

## 3.2: Create New Project and Deploy

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your GitHub repositories
4. Find **"FlipCut"** repository and click on it
5. Railway will ask which branch to deploy:
   - Select **"main"** (or "master" if that's your default branch)
6. Railway will start detecting your project...

### 3.2.1: Configure Root Directory

Railway might auto-detect your backend, but we need to make sure it's configured correctly:

1. Once the project appears, you'll see your repository name
2. Click on the service (it might be named "FlipCut" or similar)
3. Go to **"Settings"** tab
4. Scroll down to **"Root Directory"**
5. Set it to: **`backend`**
6. Railway will automatically:
   - Detect Node.js
   - Run `npm install`
   - Run `npm run build` (from our package.json)
   - Run `npm start` to start the server

---

## 3.3: Set Environment Variables

This is the **MOST IMPORTANT STEP**! You need to set all your credentials.

1. In your Railway project, click on your service
2. Go to **"Variables"** tab
3. You'll see a form to add environment variables
4. Add each variable one by one:

### Add These Environment Variables:

Click **"+ New Variable"** for each one:

**1. Node Environment:**
- **Key:** `NODE_ENV`
- **Value:** `production`

**2. Port (Railway sets this automatically, but we'll keep it):**
- **Key:** `PORT`
- **Value:** `8000`
- ⚠️ **Note:** Railway will also set `PORT` automatically - that's fine, we can override it or Railway will use its own

**3. MongoDB Connection (REPLACE WITH YOUR COMPLETE CONNECTION STRING):**
- **Key:** `MONGO_URL`
- **Value:** `mongodb+srv://flipcut:YOUR_PASSWORD@cluster0.6rkgplg.mongodb.net/flipcut?retryWrites=true&w=majority`
- ⚠️ **Important:** Replace `YOUR_PASSWORD` with your actual MongoDB password!

**4. Database Name:**
- **Key:** `DB_NAME`
- **Value:** `flipcut`

**5. Cloudinary Cloud Name:**
- **Key:** `CLOUDINARY_CLOUD_NAME`
- **Value:** `duxdtjzty`

**6. Cloudinary API Key:**
- **Key:** `CLOUDINARY_API_KEY`
- **Value:** `636847353724441`

**7. Cloudinary API Secret:**
- **Key:** `CLOUDINARY_API_SECRET`
- **Value:** `UfxTHuIJ57_LD7ZfZgsxhxuFScE`

**8. Remove.bg API Key:**
- **Key:** `REMOVEBG_API_KEY`
- **Value:** `UfYmf4jquhGVqRFGRPeerruF`

**9. CORS Origins (Allow all for now):**
- **Key:** `CORS_ORIGINS`
- **Value:** `*`
- ⚠️ **Note:** We'll update this later with your frontend URL once frontend is deployed

### After Adding Each Variable:
- Click **"Add"** or **"Save"**
- Railway will automatically redeploy your service with the new variables

---

## 3.4: Generate Public URL (Get Your Live Backend URL!)

1. In your Railway project, click on your service
2. Go to **"Settings"** tab
3. Scroll down to **"Domains"** section
4. Click **"Generate Domain"** button
5. Railway will create a URL like: `https://your-app-name.up.railway.app`
6. **COPY THIS URL** - This is your live backend API URL! 🎉
7. Save it somewhere - you'll need it for frontend deployment

---

## 3.5: Verify Deployment

1. Wait for Railway to finish deploying (you'll see a green checkmark ✅)
2. Check the **"Deployments"** tab to see build logs
3. Once deployment is successful, test your backend:

### Test Health Endpoint:
Open in browser or use curl:
```
https://your-app-name.up.railway.app/api/health
```

**Expected Response:**
```json
{"status":"healthy"}
```

### Test API Root:
```
https://your-app-name.up.railway.app/api
```

**Expected Response:**
```json
{
  "message": "FlipCut API",
  "version": "1.0.0"
}
```

### Test Root Endpoint:
```
https://your-app-name.up.railway.app/
```

**Expected Response:**
```json
{
  "message": "FlipCut API Server",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {...}
}
```

---

## 3.6: Check Deployment Logs (Troubleshooting)

If something doesn't work:

1. Go to **"Deployments"** tab in Railway
2. Click on the latest deployment
3. Check the **"Build Logs"** and **"Deploy Logs"**
4. Look for any errors

### Common Issues:

**Build Fails:**
- Check if TypeScript compiles: Make sure `npm run build` works locally
- Check Node.js version: Railway should auto-detect, but verify it's 18+

**Server Won't Start:**
- Check environment variables are all set correctly
- Verify `MONGO_URL` is correct (with actual password)
- Check PORT variable (Railway sets this automatically)

**Database Connection Fails:**
- Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Double-check username and password in connection string
- Ensure MongoDB Atlas cluster is running (not paused)

**CORS Errors:**
- Verify `CORS_ORIGINS` is set to `*` for now
- We'll update this after frontend deployment

---

## ✅ Success Checklist

Once your backend is deployed and working, you should have:

- ✅ Railway account created
- ✅ Project deployed from GitHub
- ✅ All environment variables set correctly
- ✅ Public URL generated (e.g., `https://your-app.up.railway.app`)
- ✅ Health endpoint returns: `{"status":"healthy"}`
- ✅ API endpoints accessible from the internet
- ✅ MongoDB connection working (check logs - should see "Connected to MongoDB")

---

## Next Steps

Once your backend is live and working:

1. ✅ **Save your backend URL** (e.g., `https://your-app.up.railway.app`)
2. ✅ **Test all endpoints** to ensure everything works
3. ✅ **Note your backend URL** - you'll need it for frontend deployment
4. → **Proceed to Frontend Deployment** (we'll cover this next!)

---

## Quick Reference: Your Environment Variables Template

Use this when setting variables on Railway:

```
NODE_ENV=production
PORT=8000
MONGO_URL=mongodb+srv://flipcut:YOUR_PASSWORD@cluster0.6rkgplg.mongodb.net/flipcut?retryWrites=true&w=majority
DB_NAME=flipcut
CLOUDINARY_CLOUD_NAME=duxdtjzty
CLOUDINARY_API_KEY=636847353724441
CLOUDINARY_API_SECRET=UfxTHuIJ57_LD7ZfZgsxhxuFScE
REMOVEBG_API_KEY=UfYmf4jquhGVqRFGRPeerruF
CORS_ORIGINS=*
```

**Remember:** Replace `YOUR_PASSWORD` with your actual MongoDB password!
