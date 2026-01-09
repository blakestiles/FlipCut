from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import cloudinary
import cloudinary.uploader
from PIL import Image
import io
import base64
import aiofiles
import tempfile

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
    secure=True
)

# Create the main app
app = FastAPI(title="FlipCut API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ImageAsset(BaseModel):
    image_id: str = Field(default_factory=lambda: f"img_{uuid.uuid4().hex[:12]}")
    user_id: str
    original_filename: str
    original_mime_type: str
    original_size_bytes: int
    original_width: Optional[int] = None
    original_height: Optional[int] = None
    status: str = "UPLOADED"  # UPLOADED, PROCESSING, PROCESSED, FAILED, DELETED
    provider: str = "REMOVEBG"
    original_url: Optional[str] = None
    bg_removed_url: Optional[str] = None
    processed_url: Optional[str] = None
    cloudinary_public_id: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ImageUploadResponse(BaseModel):
    image_id: str
    status: str
    message: str

class ImageProcessResponse(BaseModel):
    image_id: str
    status: str
    processed_url: Optional[str] = None
    message: str

class ImageListResponse(BaseModel):
    items: List[dict]

# ============== AUTH HELPERS ==============

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token in cookie or header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        return None
    
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Require authentication, raise 401 if not authenticated"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for session_token"""
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Exchange session_id with Emergent Auth
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session_id")
            
            auth_data = auth_response.json()
        except Exception as e:
            logger.error(f"Auth exchange error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    email = auth_data.get("email")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
    else:
        # Create new user
        new_user = {
            "user_id": user_id,
            "email": email,
            "name": auth_data.get("name", ""),
            "picture": auth_data.get("picture", ""),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    # Create session
    session_token = auth_data.get("session_token") or f"sess_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Delete old sessions for this user
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {
        "success": True,
        "user": user_doc
    }

@api_router.get("/auth/me")
async def get_me(user: User = Depends(require_auth)):
    """Get current authenticated user"""
    return {
        "user_id": user.user_id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout and clear session"""
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )
    
    return {"success": True, "message": "Logged out"}

# ============== IMAGE ENDPOINTS ==============

ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/webp"}
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8MB

@api_router.post("/images/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    user: User = Depends(require_auth)
):
    """Upload an image for processing"""
    # Validate mime type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_MIME_TYPES)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Get image dimensions
    try:
        img = Image.open(io.BytesIO(content))
        width, height = img.size
    except Exception:
        width, height = None, None
    
    # Upload original to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(
            content,
            folder=f"flipcut/{user.user_id}/originals",
            resource_type="image"
        )
        original_url = upload_result.get("secure_url")
        original_public_id = upload_result.get("public_id")
    except Exception as e:
        logger.error(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image")
    
    # Create image asset record
    image_asset = ImageAsset(
        user_id=user.user_id,
        original_filename=file.filename or "uploaded_image",
        original_mime_type=file.content_type,
        original_size_bytes=len(content),
        original_width=width,
        original_height=height,
        original_url=original_url,
        cloudinary_public_id=original_public_id,
        status="UPLOADED"
    )
    
    doc = image_asset.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    
    await db.images.insert_one(doc)
    
    return ImageUploadResponse(
        image_id=image_asset.image_id,
        status="UPLOADED",
        message="Image uploaded successfully. Ready for processing."
    )

@api_router.post("/images/{image_id}/process", response_model=ImageProcessResponse)
async def process_image(image_id: str, user: User = Depends(require_auth)):
    """Process image: remove background and flip horizontally"""
    # Get image record
    image_doc = await db.images.find_one(
        {"image_id": image_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not image_doc:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Check if already processed
    if image_doc["status"] == "PROCESSED":
        return ImageProcessResponse(
            image_id=image_id,
            status="PROCESSED",
            processed_url=image_doc.get("processed_url"),
            message="Image already processed"
        )
    
    # Check if currently processing
    if image_doc["status"] == "PROCESSING":
        raise HTTPException(status_code=409, detail="Image is currently being processed")
    
    # Update status to processing
    await db.images.update_one(
        {"image_id": image_id},
        {"$set": {"status": "PROCESSING", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    try:
        # Step 1: Remove background using remove.bg API
        removebg_api_key = os.environ.get("REMOVEBG_API_KEY")
        if not removebg_api_key:
            raise HTTPException(status_code=500, detail="Background removal service not configured")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.remove.bg/v1.0/removebg",
                data={
                    "image_url": image_doc["original_url"],
                    "size": "auto",
                    "format": "png"
                },
                headers={"X-Api-Key": removebg_api_key}
            )
            
            if response.status_code == 429:
                await db.images.update_one(
                    {"image_id": image_id},
                    {"$set": {"status": "FAILED", "error_message": "Rate limit exceeded. Please try again later.", "updated_at": datetime.now(timezone.utc).isoformat()}}
                )
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            
            if response.status_code != 200:
                error_msg = f"Background removal failed: {response.text}"
                await db.images.update_one(
                    {"image_id": image_id},
                    {"$set": {"status": "FAILED", "error_message": error_msg, "updated_at": datetime.now(timezone.utc).isoformat()}}
                )
                raise HTTPException(status_code=502, detail=error_msg)
            
            bg_removed_content = response.content
        
        # Step 2: Flip horizontally using Pillow
        img = Image.open(io.BytesIO(bg_removed_content))
        flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
        
        # Save flipped image to bytes
        output_buffer = io.BytesIO()
        flipped_img.save(output_buffer, format="PNG")
        flipped_content = output_buffer.getvalue()
        
        # Step 3: Upload processed image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            flipped_content,
            folder=f"flipcut/{user.user_id}/processed",
            resource_type="image",
            format="png"
        )
        
        processed_url = upload_result.get("secure_url")
        processed_public_id = upload_result.get("public_id")
        
        # Update database record
        await db.images.update_one(
            {"image_id": image_id},
            {
                "$set": {
                    "status": "PROCESSED",
                    "processed_url": processed_url,
                    "cloudinary_public_id": processed_public_id,
                    "error_message": None,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return ImageProcessResponse(
            image_id=image_id,
            status="PROCESSED",
            processed_url=processed_url,
            message="Image processed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing error: {e}")
        await db.images.update_one(
            {"image_id": image_id},
            {"$set": {"status": "FAILED", "error_message": str(e), "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@api_router.get("/images", response_model=ImageListResponse)
async def list_images(user: User = Depends(require_auth)):
    """List all images for the current user"""
    cursor = db.images.find(
        {"user_id": user.user_id, "status": {"$ne": "DELETED"}},
        {"_id": 0}
    ).sort("created_at", -1)
    
    items = await cursor.to_list(1000)
    
    return ImageListResponse(items=items)

@api_router.get("/images/{image_id}")
async def get_image(image_id: str, user: User = Depends(require_auth)):
    """Get a single image by ID"""
    image_doc = await db.images.find_one(
        {"image_id": image_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not image_doc:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return image_doc

@api_router.delete("/images/{image_id}")
async def delete_image(image_id: str, user: User = Depends(require_auth)):
    """Delete an image from Cloudinary and database"""
    image_doc = await db.images.find_one(
        {"image_id": image_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not image_doc:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete from Cloudinary
    try:
        if image_doc.get("cloudinary_public_id"):
            cloudinary.uploader.destroy(image_doc["cloudinary_public_id"], invalidate=True)
    except Exception as e:
        logger.error(f"Cloudinary delete error: {e}")
    
    # Mark as deleted in database
    await db.images.update_one(
        {"image_id": image_id},
        {"$set": {"status": "DELETED", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"success": True, "message": "Image deleted successfully"}

# ============== HEALTH CHECK ==============

@api_router.get("/")
async def root():
    return {"message": "FlipCut API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
