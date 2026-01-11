# Fix Railway Root Directory Issue

## Problem
Railway is trying to build from the root directory instead of the `backend` folder.

## Solution: Set Root Directory

### Step-by-Step:

1. **In your Railway dashboard:**
   - Look at your project (the one that just failed to build)
   - You should see a service/card with your repository name

2. **Click on your service** (the card/box representing your deployment)

3. **Go to Settings:**
   - Look for a **"Settings"** tab or button
   - Click on it

4. **Find "Root Directory" or "Source":**
   - Scroll down in the Settings page
   - Look for a section called:
     - **"Root Directory"** OR
     - **"Source"** OR  
     - **"Build Settings"**
   
5. **Set the Root Directory:**
   - You should see a field that says something like:
     - "Root Directory: /" or "Root Directory: (empty)"
   - Change it to: **`backend`**
   - Click **"Save"** or **"Update"**

6. **Alternative: If you don't see Root Directory option:**
   - Look for **"Service Settings"** or **"Configure"**
   - Some Railway interfaces have it under **"Source"** tab
   - Or try clicking the **three dots (⋮)** menu on your service → **"Settings"**

7. **After saving:**
   - Railway will automatically trigger a new build
   - Go to the **"Deployments"** tab to watch it build
   - It should now detect Node.js and build correctly!

---

## Visual Guide (What to Look For):

```
Railway Dashboard
└── Your Project
    └── Your Service (FlipCut or repository name)
        ├── [Deployments Tab]
        ├── [Variables Tab]
        └── [Settings Tab] ← CLICK HERE
            └── Scroll down to find:
                └── Root Directory: [backend] ← SET THIS
```

---

## What Should Happen:

After setting Root Directory to `backend`, Railway should:
1. ✅ Detect Node.js automatically
2. ✅ Run `npm install`
3. ✅ Run `npm run build` (from package.json)
4. ✅ Run `npm start` to start the server

---

## Need Help Finding Settings?

If you can't find the Settings or Root Directory option:
1. Try clicking on the **service name** (not just the project)
2. Look for a **gear icon (⚙️)** or **settings icon**
3. Check if there's a **"Configure"** or **"Edit"** button
4. Railway's UI might vary - look for any tab/button related to configuration

Once you've set the Root Directory to `backend`, let me know and we'll check if the build works!
