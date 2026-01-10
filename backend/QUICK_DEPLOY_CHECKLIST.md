# Quick Deployment Checklist

## ✅ Step 1: Complete MongoDB Connection String

You need to replace `<db_password>` in your MongoDB connection string.

**Your Current Connection String:**
```
mongodb+srv://flipcut:<db_password>@cluster0.6rkgplg.mongodb.net/?appName=Cluster0
```

**How to Get Your Password:**

### Option A: Check Your Local .env File (if it exists)
1. Open `backend/.env` file on your computer
2. Look for `MONGO_URL` 
3. Copy the password from there

### Option B: Reset Password in MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Log in
3. Click **"Database Access"** (left sidebar)
4. Find user: `flipcut`
5. Click **"Edit"** → **"Edit Password"**
6. Generate or create a new password
7. **SAVE THE PASSWORD** somewhere secure
8. Click **"Update User"**

### Option C: Check if You Have a Password Manager
- Check if you saved the MongoDB password in a password manager
- Search for "mongodb" or "flipcut"

**Once You Have the Password:**
Complete your connection string:
```
mongodb+srv://flipcut:YOUR_PASSWORD_HERE@cluster0.6rkgplg.mongodb.net/flipcut?retryWrites=true&w=majority
```

**Important:** If your password has special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `/` → `%2F`

## ✅ Step 2: Verify MongoDB Network Access

Make sure your MongoDB Atlas allows connections from anywhere (needed for deployment):

1. Go to https://cloud.mongodb.com/
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"** (if none exist)
4. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
5. Click **"Confirm"**

## ✅ Step 3: Ready for Railway Deployment

Once you have:
- ✅ Complete MongoDB connection string with password
- ✅ Network access set to `0.0.0.0/0`
- ✅ All your API keys ready (Cloudinary, Remove.bg)

→ You're ready for **STEP 3: Deploy to Railway!**

---

## Your Credentials Summary (Keep Secure!)

✅ **Cloudinary:**
- Cloud Name: `duxdtjzty`
- API Key: `636847353724441`
- API Secret: `UfxTHuIJ57_LD7ZfZgsxhxuFScE`

✅ **Remove.bg:**
- API Key: `UfYmf4jquhGVqRFGRPeerruF`

✅ **MongoDB:**
- Username: `flipcut`
- Cluster: `cluster0.6rkgplg.mongodb.net`
- Database Name: `flipcut`
- Password: **_[You need to complete this]_**
