# Environment Variables Guide

## 🔴 Backend Environment Variables (Required for Deployment)

### Required Variables:

| Variable Name | Description | Example | Where to Get |
|--------------|-------------|---------|--------------|
| **MONGO_URL** | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| **DB_NAME** | Your database name | `flipcut` | Choose any name |
| **CLOUDINARY_CLOUD_NAME** | Cloudinary cloud name | `your-cloud-name` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| **CLOUDINARY_API_KEY** | Cloudinary API key | `123456789012345` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| **CLOUDINARY_API_SECRET** | Cloudinary API secret | `abcdefghijklmnopqrstuvwxyz` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| **REMOVEBG_API_KEY** | remove.bg API key | `abcdefghijklmnopqrstuvwxyz123456` | [remove.bg API](https://www.remove.bg/api) |

### Optional Variables:

| Variable Name | Description | Default Value | Notes |
|--------------|-------------|---------------|-------|
| **NODE_ENV** | Environment mode | `development` | Set to `production` for production |
| **PORT** | Server port | `8000` | Vercel auto-assigns, but you can set it |
| **CORS_ORIGINS** | Allowed origins (comma-separated) | `http://localhost:3000,http://127.0.0.1:3000` | Include your frontend URL and `*` for wildcard |

---

## 🟢 Frontend Environment Variables (Required for Deployment)

### Required Variables:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| **REACT_APP_BACKEND_URL** | Your backend API URL | `https://flipcut-backend-xxx.vercel.app` |

---

## 📋 Complete Environment Variables List (Copy-Paste Ready)

### For Backend Deployment (Vercel/Railway/Render):

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=flipcut
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
REMOVEBG_API_KEY=your_removebg_api_key
NODE_ENV=production
PORT=8000
CORS_ORIGINS=https://your-frontend-url.vercel.app,*
```

### For Frontend Deployment (Vercel):

```
REACT_APP_BACKEND_URL=https://your-backend-url.vercel.app
```

---

## 🔑 How to Get API Keys

### 1. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add database name at the end: `mongodb+srv://.../?retryWrites=true&w=majority` → `mongodb+srv://.../flipcut?retryWrites=true&w=majority`

### 2. Cloudinary (Image Storage)
1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Sign up for free account
3. Go to Dashboard → Settings → Account Details
4. Copy:
   - **Cloud name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### 3. remove.bg (Background Removal)
1. Go to [remove.bg](https://www.remove.bg/api)
2. Sign up for free account (50 free API calls/month)
3. Go to API page → Copy your API key
4. Paste into `REMOVEBG_API_KEY`

---

## ⚠️ Important Notes

1. **CORS_ORIGINS**: After deploying frontend, update `CORS_ORIGINS` in backend to include your frontend URL:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app,*
   ```

2. **REACT_APP_BACKEND_URL**: Only set this AFTER deploying backend and getting the URL.

3. **Never commit `.env` files** - Always use your deployment platform's environment variable settings.

4. **Variable Names**: 
   - Backend variables can be any name
   - Frontend variables **MUST** start with `REACT_APP_` to be accessible in the browser
