# remove.bg API Setup Guide

## Why remove.bg?

FlipCut uses remove.bg API to automatically remove backgrounds from images. You need a remove.bg API key to enable this feature.

## Quick Setup (5 minutes)

### Step 1: Create Free remove.bg Account

1. **Sign up for free:**
   - Go to: https://www.remove.bg/api
   - Click "Get API Key" or "Sign Up Free"
   - Create a free account

### Step 2: Get Your API Key

After signing up:
1. Go to your Dashboard: https://www.remove.bg/api#remove-background
2. Copy your **API Key** (it looks like: `abcdefghijklmnopqrstuvwxyz`)

### Step 3: Free Tier Limits

The free tier includes:
- ✅ 50 free API calls per month
- ✅ Perfect for testing and small projects
- ✅ No credit card required

### Step 4: Update backend/.env

Open `backend/.env` and replace:

```env
REMOVEBG_API_KEY=your_actual_api_key_here
```

### Step 5: Restart Backend

After updating `.env`, restart your backend server.

---

## Alternative: Use Different Background Removal Service

If you prefer a different service or want unlimited usage:
- Remove.bg paid plans
- Other AI background removal APIs
- We can modify the code to use a different service

---

## Need Help?

- **remove.bg Docs**: https://www.remove.bg/api
- **Dashboard**: https://www.remove.bg/api#remove-background
