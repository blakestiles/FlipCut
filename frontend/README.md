# FlipCut Frontend

React-based frontend application for FlipCut - an AI-powered image processing platform that removes backgrounds and applies horizontal flips to images.

## Overview

FlipCut Frontend is a modern, responsive web application built with React 19. It provides an intuitive interface for users to upload images, process them with AI background removal, and manage their processed image gallery.

## Features

- **User Authentication**: Google OAuth integration via Emergent Auth
- **Image Upload**: Drag-and-drop file upload with validation (PNG, JPEG, WebP up to 8MB)
- **AI Background Removal**: Integration with remove.bg API for automatic background removal
- **Image Processing**: Automatic horizontal flip transformation using Sharp
- **Image Gallery**: View and manage all processed images with status tracking
- **Cloud Storage**: Images stored and served via Cloudinary
- **Modern UI**: Built with shadcn/ui components, TailwindCSS, and Framer Motion animations
- **Responsive Design**: Fully responsive layout for desktop and mobile devices

## Tech Stack

- **React** 19 - UI framework
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API requests
- **React Dropzone** - Drag-and-drop file uploads
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **CRACO** - Create React App Configuration Override

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running on port 8000 (see [backend README](../backend/README.md))

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`

Runs the app in development mode with hot reloading.
- Opens at [http://localhost:3000](http://localhost:3000)
- Page reloads automatically when you make changes
- Displays lint errors in the console

### `npm run build`

Builds the app for production to the `build` folder.
- Optimizes and minifies the bundle
- Creates production-ready static files
- Ready for deployment to hosting services

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   └── favicon.svg     # Application favicon
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── effects/   # Animation effect components
│   │   ├── Navbar.jsx # Navigation bar
│   │   └── AuthCallback.jsx # OAuth callback handler
│   ├── pages/         # Page components
│   │   ├── LandingPage.jsx  # Landing page
│   │   └── Dashboard.jsx    # Main dashboard
│   ├── hooks/         # Custom React hooks
│   │   └── use-toast.js    # Toast notification hook
│   ├── lib/           # Utility functions
│   │   └── utils.js   # Helper functions
│   ├── App.js         # Main application component
│   ├── App.css        # Global application styles
│   ├── index.js       # Application entry point
│   └── index.css      # Global styles
├── plugins/           # Webpack plugins
│   ├── health-check/  # Health check endpoints
│   └── visual-edits/  # Visual editing tools
├── package.json       # Dependencies and scripts
├── tailwind.config.js # TailwindCSS configuration
├── craco.config.js    # CRACO configuration
└── jsconfig.json      # JavaScript path aliases
```

## Key Components

### Pages

- **LandingPage**: Marketing/landing page with features showcase and CTA buttons
- **Dashboard**: Main application interface for image upload and gallery management

### Effects Components

- **MagneticText**: Text with magnetic cursor-following effect
- **ScrollReveal**: Scroll-triggered reveal animations
- **SpotlightCard**: Cards with mouse-following spotlight effect
- **BeforeAfterSlider**: Image comparison slider component
- **AnimatedButtons**: Animated button components

### UI Components

All shadcn/ui components including:
- Button, Card, Dialog, Dropdown, Toast, and more
- Located in `src/components/ui/`

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

- `REACT_APP_BACKEND_URL`: Backend API base URL (required)

## Authentication Flow

1. User clicks "Sign in" button
2. Redirects to Emergent Auth OAuth provider
3. After authentication, redirects back with `session_id` in URL fragment
4. `AuthCallback` component exchanges `session_id` for session token
5. Session token stored in HTTP-only cookie
6. User authenticated and redirected to dashboard

## API Integration

The frontend communicates with the backend API via axios:

- Base URL: Configured via `REACT_APP_BACKEND_URL`
- Credentials: Cookies enabled for session management
- API instance: Created in `App.js` and exported as `apiClient`

### Main API Endpoints Used

- `POST /api/auth/session` - Exchange OAuth session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/images/upload` - Upload image
- `POST /api/images/:id/process` - Process image
- `GET /api/images` - List user images
- `DELETE /api/images/:id` - Delete image

## Styling

- **TailwindCSS**: Utility-first CSS framework
- **Custom CSS**: Additional styles in `App.css` and `index.css`
- **Theme**: Dark theme with black/white color scheme
- **Fonts**: Inter font family for typography
- **Animations**: Framer Motion for smooth transitions and effects

## Development Notes

### Path Aliases

The project uses path aliases configured in `jsconfig.json`:
- `@/` maps to `src/` directory
- Example: `import Button from "@/components/ui/button"`

### State Management

- React Context API for authentication state
- Local component state for UI interactions
- No external state management library required

### Error Handling

- Toast notifications via Sonner for user feedback
- API errors handled in axios interceptors
- Graceful fallbacks for failed operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

1. Build the production bundle:
```bash
npm run build
```

2. The `build` folder contains static files ready for deployment

3. Deploy to your preferred hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

4. Set environment variables in your hosting platform:
   - `REACT_APP_BACKEND_URL`: Your production backend URL

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
- Kill the process using port 3000
- Or set `PORT=3001` in `.env` file

### API Connection Issues

- Verify backend is running on the correct port
- Check `REACT_APP_BACKEND_URL` in `.env`
- Verify CORS settings in backend configuration

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build && npm run build`

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components (when applicable)
3. Ensure all components are responsive
4. Test thoroughly before submitting changes

## License

See the main project LICENSE file for details.
