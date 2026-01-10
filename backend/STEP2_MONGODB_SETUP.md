# STEP 2: MongoDB Atlas Setup - Complete Your Connection String

## Current Status
✅ You already have a MongoDB Atlas cluster: `cluster0.6rkgplg.mongodb.net`
✅ Username: `flipcut`
❌ You need to complete the connection string with your database password

## Option 1: If You Already Know Your Password

If you set a password when creating the `flipcut` database user:

1. Your complete connection string should be:
   ```
   mongodb+srv://flipcut:YOUR_PASSWORD_HERE@cluster0.6rkgplg.mongodb.net/?appName=Cluster0
   ```
   Replace `YOUR_PASSWORD_HERE` with your actual password.

2. **Important:** If your password contains special characters, you need to URL-encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`
   - `/` becomes `%2F`
   - `?` becomes `%3F`
   - etc.

## Option 2: Reset/Create New Database User Password

If you don't know your password or want to create a new one:

### Steps:

1. **Go to MongoDB Atlas:**
   - Visit [cloud.mongodb.com](https://cloud.mongodb.com/)
   - Log in to your account

2. **Navigate to Database Access:**
   - Click **"Database Access"** in the left sidebar
   - Find the user with username `flipcut`

3. **Edit the User:**
   - Click **"Edit"** next to the `flipcut` user
   - Click **"Edit Password"**
   - Generate a new password (click "Autogenerate Secure Password" or create your own)
   - **COPY AND SAVE THE PASSWORD** in a secure place
   - Click **"Update User"**

4. **Complete Your Connection String:**
   ```
   mongodb+srv://flipcut:YOUR_NEW_PASSWORD@cluster0.6rkgplg.mongodb.net/?appName=Cluster0
   ```
   Replace `YOUR_NEW_PASSWORD` with the password you just created/saved.

5. **Add Database Name (Optional but Recommended):**
   For better connection management, append the database name:
   ```
   mongodb+srv://flipcut:YOUR_PASSWORD@cluster0.6rkgplg.mongodb.net/flipcut?retryWrites=true&w=majority
   ```

## Option 3: Verify Network Access

Before deployment, make sure your MongoDB Atlas allows connections from anywhere:

1. **Go to Network Access in MongoDB Atlas:**
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**

2. **Allow from Anywhere (for deployment):**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` which allows all IPs
   - Click **"Confirm"**
   
   ⚠️ **Security Note:** This is okay for deployment, but in production you might want to restrict to specific IPs.

## Test Your Connection String Locally (Optional)

You can test your connection string works by updating your local `.env` file:

1. Open `backend/.env` (create it if it doesn't exist)
2. Add your complete connection string:
   ```
   MONGO_URL=mongodb+srv://flipcut:YOUR_PASSWORD@cluster0.6rkgplg.mongodb.net/flipcut?retryWrites=true&w=majority
   DB_NAME=flipcut
   ```
3. Test locally:
   ```bash
   cd backend
   npm run build
   npm start
   ```
4. If it connects successfully, you'll see: `✅ Connected to MongoDB`

## Next Steps After Completing MongoDB Setup

Once you have your complete MongoDB connection string ready:

1. ✅ Save it securely (you'll need it for Railway/Render)
2. ✅ Test it works locally (optional but recommended)
3. → **Proceed to STEP 3: Deploy to Railway/Render**

## Need Help?

If you're stuck:
- Check MongoDB Atlas dashboard for user credentials
- Verify network access is set to `0.0.0.0/0`
- Test the connection string format is correct
