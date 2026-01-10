# How to Start FlipCut Project

## Quick Start

### 1. Start Backend (TypeScript/Express)
```bash
cd backend
npm run dev
```
Backend will run on: **http://localhost:8000**

### 2. Start Frontend (React)
```bash
cd frontend
npm start
```
Frontend will run on: **http://localhost:3000**

## Fixed Issues

✅ **Backend running** on port 8000
✅ **Favicon 404 fixed** - Added SVG favicon to prevent 404 error
✅ **Frontend .env created** - Backend URL configured: `http://localhost:8000`
✅ **Dependencies installed** - Both backend and frontend dependencies installed

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=flipcut
CORS_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REMOVEBG_API_KEY=your_removebg_api_key
PORT=8000
```

### Frontend (`frontend/.env`)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

## Notes

- Backend starts immediately
- Frontend takes 30-60 seconds to compile on first start
- Chrome extension errors in console are harmless (can be ignored)
- MongoDB is optional for basic endpoints (health, root) but required for full functionality

## Troubleshooting

If frontend doesn't start:
1. Check if port 3000 is already in use
2. Wait 30-60 seconds for compilation
3. Check console for errors
4. Try `npm start` again

If backend doesn't start:
1. Check if port 8000 is already in use
2. Verify .env file exists
3. Check MongoDB connection (if using auth/image endpoints)
