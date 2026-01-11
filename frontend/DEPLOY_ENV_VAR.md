# Frontend Environment Variable for Deployment

## Required Environment Variable

When deploying to Vercel/Netlify, add this environment variable:

### Variable:
- **Key**: `REACT_APP_BACKEND_URL`
- **Value**: `https://flipcut-production.up.railway.app`

### Why?
The frontend needs to know where the backend API is located. This environment variable is used in `src/App.js` to configure the API client.

---

## Quick Copy-Paste

For Vercel/Netlify environment variables:

```
REACT_APP_BACKEND_URL=https://flipcut-production.up.railway.app
```

---

## After Deployment

Once your frontend is deployed and you have the URL:

1. ✅ Get your frontend URL (e.g., `https://your-app.vercel.app`)
2. ✅ Update backend CORS_ORIGINS on Railway with your frontend URL
3. ✅ Test the integration

---

## Your URLs:

- **Backend**: `https://flipcut-production.up.railway.app`
- **Frontend**: `[Your Vercel/Netlify URL - you'll get this after deployment]`
