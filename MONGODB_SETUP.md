# MongoDB Setup Guide for FlipCut

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Easiest - 5 minutes) ⭐ RECOMMENDED

1. **Sign up for free MongoDB Atlas account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (M0 free tier is perfect)

2. **Create a cluster:**
   - Choose a cloud provider (AWS, Google Cloud, or Azure)
   - Select a region close to you
   - Name your cluster (e.g., "FlipCut")

3. **Create a database user:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `flipcut` (or your choice)
   - Password: Generate a secure password (save it!)
   - Set privileges: "Atlas Admin"

4. **Whitelist your IP:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add `0.0.0.0/0`
   - Save

5. **Get your connection string:**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add your database name: `mongodb+srv://username:password@cluster.mongodb.net/flipcut?retryWrites=true&w=majority`

6. **Update backend/.env:**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/flipcut?retryWrites=true&w=majority
   DB_NAME=flipcut
   ```

7. **Restart your backend server**

---

### Option 2: Install MongoDB Locally

#### Windows (Using MongoDB Installer)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows → MSI Package
   - Download and run installer

2. **Install MongoDB:**
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Install MongoDB Compass (optional GUI)

3. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - Verify: Open Command Prompt and run:
     ```powershell
     net start MongoDB
     ```
   - Check if running:
     ```powershell
     netstat -ano | findstr :27017
     ```

4. **Update backend/.env:**
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=flipcut
   ```

5. **Restart your backend server**

#### Using Chocolatey (if installed)

```powershell
choco install mongodb -y
net start MongoDB
```

---

## Verify MongoDB Connection

After setup, your backend should show:
```
✅ Connected to MongoDB
```

If you see errors, check:
1. `.env` file has correct `MONGO_URL` and `DB_NAME`
2. MongoDB is running (for local install)
3. IP is whitelisted (for Atlas)
4. Password is correct in connection string

---

## Need Help?

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **MongoDB Community Docs**: https://docs.mongodb.com/manual/installation/
