# FlipCut Backend - TypeScript

TypeScript/Express.js backend for the FlipCut image processing application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (using official Node.js driver)
- **Image Processing**: Sharp
- **Cloud Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: Zod (types defined in TypeScript interfaces)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory (see `.env.example` for required variables):
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - `MONGO_URL`: MongoDB connection string
   - `DB_NAME`: Database name
   - `CORS_ORIGINS`: Comma-separated list of allowed origins
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `REMOVEBG_API_KEY`: Your remove.bg API key
   - `PORT`: Server port (default: 8000)

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run production build:
```bash
npm start
```

Type check:
```bash
npm run type-check
```

## API Endpoints

### Health
- `GET /api` - API info
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/session` - Exchange OAuth session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Images
- `POST /api/images/upload` - Upload image
- `POST /api/images/:image_id/process` - Process image (remove bg + flip)
- `GET /api/images` - List user images
- `GET /api/images/:image_id` - Get single image
- `DELETE /api/images/:image_id` - Delete image

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── cloudinary.ts     # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.ts           # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts           # Auth routes
│   │   └── images.ts         # Image routes
│   ├── types/
│   │   └── models.ts         # TypeScript interfaces
│   └── server.ts             # Express app setup
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env                      # Environment variables (not in git)
```

## Migration from Python

This TypeScript backend is a direct port of the original Python FastAPI backend. Key differences:

- **FastAPI** → **Express.js**
- **Motor (async MongoDB)** → **MongoDB Node.js driver**
- **Pydantic** → **TypeScript interfaces**
- **Pillow** → **Sharp**
- **httpx** → **axios**
- **python-dotenv** → **dotenv**

All functionality remains the same, including:
- OAuth session exchange with Emergent Auth
- Image upload with validation
- Background removal via remove.bg API
- Horizontal flip using Sharp
- Cloudinary storage integration
- MongoDB data persistence
