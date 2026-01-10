# Network Error Troubleshooting Guide

## If you're getting network errors when signing in:

### Step 1: Verify Backend is Deployed and Accessible

1. Check your backend URL (you mentioned it but didn't provide it)
2. Visit: `https://YOUR-BACKEND-URL.vercel.app/api/health`
3. You should see: `{"status":"healthy"}`

### Step 2: Check Frontend Environment Variable

**In your Frontend Vercel project:**

1. Go to: Project Settings → Environment Variables
2. Check if `REACT_APP_BACKEND_URL` exists
3. Value should be: `https://YOUR-BACKEND-URL.vercel.app` (NO trailing slash)
4. Make sure it's set for **Production** environment

### Step 3: Check Backend CORS Configuration

**In your Backend Vercel project:**

1. Go to: Project Settings → Environment Variables
2. Check `CORS_ORIGINS` variable
3. Value should include your frontend URL:
   ```
   https://flip-cut-uplane.vercel.app,*
   ```
4. Make sure there are NO spaces and NO trailing slashes

### Step 4: Redeploy Both Projects

After updating environment variables:
1. **Backend**: Go to Deployments → Click "..." → Redeploy
2. **Frontend**: Go to Deployments → Click "..." → Redeploy

### Step 5: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click the refresh button → "Empty Cache and Hard Reload"
3. Or use Incognito/Private mode

### Step 6: Check Browser Console

Open DevTools Console and look for:
- `REACT_APP_BACKEND_URL is not set!` → Frontend env var missing
- `CORS blocked origin` → Backend CORS not configured
- `Network error` → Backend URL incorrect or backend down
