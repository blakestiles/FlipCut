# Starting the FlipCut Backend Server

## Prerequisites

1. **MongoDB must be running**
   - Make sure MongoDB is installed and running on your system
   - Default connection: `mongodb://localhost:27017`
   - Or update `MONGO_URL` in `.env` to your MongoDB connection string

2. **Environment Variables**
   - Edit `backend/.env` and fill in your actual credentials:
     - `MONGO_URL` - MongoDB connection string
     - `DB_NAME` - Database name (default: `flipcut`)
     - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY` - Your Cloudinary API key
     - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
     - `REMOVEBG_API_KEY` - Your remove.bg API key
     - `CORS_ORIGINS` - Allowed origins (comma-separated)
     - `PORT` - Server port (default: 8000)

## Starting the Server

### Development Mode (with hot reload)
```bash
cd backend
npm run dev
```

### Production Mode
```bash
cd backend
npm run build
npm start
```

## Verifying the Server

Once started, you should see:
```
FlipCut API server running on port 8000
Environment: development
Connected to MongoDB
```

Test the health endpoint:
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"healthy"}
```

## Troubleshooting

### Server won't start
- **Check MongoDB**: Ensure MongoDB is running
  ```bash
  # Windows (if installed as service)
  net start MongoDB
  
  # Or check if it's running
  netstat -ano | findstr :27017
  ```

- **Check .env file**: Make sure all required variables are set (not placeholders)

- **Check port 8000**: Make sure port 8000 is not already in use
  ```bash
  netstat -ano | findstr :8000
  ```

### Connection Errors
- Verify your MongoDB connection string in `.env`
- Check MongoDB logs for connection issues
- Ensure MongoDB is accessible from your network

### Missing Dependencies
```bash
cd backend
npm install
```

## API Endpoints

Once running, the server provides:
- `GET /api` - API info
- `GET /api/health` - Health check
- `POST /api/auth/session` - OAuth session exchange
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/images/upload` - Upload image
- `POST /api/images/:id/process` - Process image
- `GET /api/images` - List images
- `GET /api/images/:id` - Get image
- `DELETE /api/images/:id` - Delete image
