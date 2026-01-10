# Cloudinary Setup Guide for FlipCut

## Why Cloudinary?

FlipCut uses Cloudinary to store uploaded images and processed images. You need a Cloudinary account to enable image uploads.

## Quick Setup (5 minutes)

### Step 1: Create Free Cloudinary Account

1. **Sign up for free:**
   - Go to: https://cloudinary.com/users/register/free
   - Create a free account (no credit card required)

### Step 2: Get Your Credentials

After signing up, you'll be taken to your Dashboard. Look for:

1. **Cloud Name** - At the top of the dashboard (e.g., `dmo6nyjzy`)
2. **API Key** - Visible on the dashboard
3. **API Secret** - Click "Reveal" to show it (save it securely!)

### Step 3: Update backend/.env

Open `backend/.env` and replace the placeholder values:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dmo6nyjzy
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Step 4: Restart Backend

After updating `.env`, restart your backend server:

```powershell
# Stop the backend (Ctrl+C) and restart:
cd backend
npm run dev
```

### Step 5: Test Upload

Try uploading an image again - it should work now! 🎉

---

## Free Tier Limits

Cloudinary's free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ Unlimited transformations
- ✅ Perfect for development and small projects

---

## Need Help?

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Dashboard**: https://console.cloudinary.com/
