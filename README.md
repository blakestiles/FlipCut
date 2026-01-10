# FlipCut

AI-powered image processing platform that removes backgrounds and applies horizontal flips to images. Built with React and TypeScript/Express.js.

## Overview

FlipCut is a full-stack web application that enables users to upload images, automatically remove backgrounds using AI, and apply horizontal flip transformations. Processed images are stored in the cloud and accessible through an intuitive dashboard.

## Tech Stack

**Frontend:**
- React 19
- TailwindCSS
- shadcn/ui
- Framer Motion
- React Router

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB
- Sharp (image processing)
- Cloudinary (cloud storage)

**External Services:**
- remove.bg API (background removal)
- Emergent Auth (OAuth authentication)
- Cloudinary (image storage)

## Features

- 🔐 Google OAuth authentication
- 📤 Drag-and-drop image upload (PNG, JPEG, WebP, up to 8MB)
- 🤖 AI-powered background removal
- 🔄 Automatic horizontal flip transformation
- 📁 Cloud-based image gallery
- 🔗 Shareable image links
- ⬇️ High-quality PNG downloads

## Project Structure

```
FlipCut/
├── backend/          # TypeScript/Express.js API server
│   ├── src/
│   │   ├── config/   # Database & Cloudinary configuration
│   │   ├── routes/   # API route handlers
│   │   ├── middleware/ # Authentication middleware
│   │   └── types/    # TypeScript interfaces
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/    # Page components
│   │   └── hooks/    # Custom React hooks
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or connection string)
- API keys for:
  - remove.bg
  - Cloudinary
  - Emergent Auth (OAuth)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/blakestiles/FlipCut.git
cd FlipCut
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your credentials
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
npm start
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Environment Variables

### Backend (`backend/.env`)
```env
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
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## API Endpoints

- `POST /api/auth/session` - Exchange OAuth session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/images/upload` - Upload image
- `POST /api/images/:id/process` - Process image (remove bg + flip)
- `GET /api/images` - List user images
- `GET /api/images/:id` - Get single image
- `DELETE /api/images/:id` - Delete image

## Documentation

- [Backend README](backend/README.md) - Backend setup and documentation
- [MongoDB Setup](MONGODB_SETUP.md) - MongoDB installation guide
- [Cloudinary Setup](CLOUDINARY_SETUP.md) - Cloudinary configuration
- [remove.bg Setup](REMOVEBG_SETUP.md) - remove.bg API setup
- [Start Project Guide](START_PROJECT.md) - Quick start instructions

## Development

- Backend runs on port 8000
- Frontend runs on port 3000
- Hot reload enabled for both during development

## License

See LICENSE file for details.
