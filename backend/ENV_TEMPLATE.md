# Environment Variables Reference

**⚠️ IMPORTANT: This file is for reference only. Never commit actual credentials to Git!**

Use this as a checklist when setting environment variables on Railway/Render.

## Required Environment Variables for Deployment

```
NODE_ENV=production
PORT=8000

MONGO_URL=your_complete_mongodb_connection_string_here
DB_NAME=flipcut

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REMOVEBG_API_KEY=your_removebg_api_key

CORS_ORIGINS=*
```

## Your Actual Values (Keep Secure!)

✅ **Cloudinary:**
- Cloud Name: `duxdtjzty`
- API Key: `636847353724441`
- API Secret: `UfxTHuIJ57_LD7ZfZgsxhxuFScE`

✅ **Remove.bg:**
- API Key: `UfYmf4jquhGVqRFGRPeerruF`

✅ **MongoDB:**
- Connection String Template: `mongodb+srv://flipcut:<db_password>@cluster0.6rkgplg.mongodb.net/?appName=Cluster0`
- **You need to replace `<db_password>` with your actual MongoDB database user password**

## Next Steps

1. Get your MongoDB database password
2. Complete the MongoDB connection string
3. Set all environment variables on Railway/Render
4. Deploy!
