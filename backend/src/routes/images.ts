import { Router, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import sharp from 'sharp';
import { getDatabase } from '../config/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { cloudinary } from '../config/cloudinary';
import {
  ImageUploadResponse,
  ImageProcessResponse,
  ImageListResponse,
  ImageAsset,
} from '../types/models';

const router = Router();

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { folder: string; resource_type?: 'image' | 'video' | 'raw' | 'auto'; format?: string }
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Upload failed: no result'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;
      const file = req.file;

      if (!file) {
        res.status(400).json({ detail: 'File is required' });
        return;
      }

      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        res.status(400).json({
          detail: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        res.status(400).json({
          detail: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        });
        return;
      }

      let width: number | null = null;
      let height: number | null = null;
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width || null;
        height = metadata.height || null;
      } catch (error) {
        console.error('Error getting image dimensions:', error);
      }

      let originalUrl: string;
      let originalPublicId: string;
      try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
          res.status(500).json({ 
            detail: 'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env. Get free credentials at: https://cloudinary.com/users/register/free' 
          });
          return;
        }

        const uploadResult = await uploadBufferToCloudinary(file.buffer, {
          folder: `flipcut/${user.user_id}/originals`,
          resource_type: 'image' as const,
        });

        originalUrl = uploadResult.secure_url;
        originalPublicId = uploadResult.public_id;
      } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        const errorMessage = error.message || 'Failed to upload image';
        if (errorMessage.includes('Invalid API Key') || errorMessage.includes('401')) {
          res.status(500).json({ 
            detail: 'Invalid Cloudinary credentials. Please check your CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env' 
          });
        } else {
          res.status(500).json({ detail: `Failed to upload image: ${errorMessage}` });
        }
        return;
      }

      const imageId = `img_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
      const now = new Date().toISOString();

      const imageAsset: ImageAsset = {
        image_id: imageId,
        user_id: user.user_id,
        original_filename: file.originalname || 'uploaded_image',
        original_mime_type: file.mimetype,
        original_size_bytes: file.size,
        original_width: width,
        original_height: height,
        status: 'UPLOADED',
        provider: 'REMOVEBG',
        original_url: originalUrl,
        cloudinary_public_id: originalPublicId,
        created_at: now,
        updated_at: now,
      };

      const db = getDatabase();
      await db.collection('images').insertOne(imageAsset);

      const response: ImageUploadResponse = {
        image_id: imageId,
        status: 'UPLOADED',
        message: 'Image uploaded successfully. Ready for processing.',
      };

      res.json(response);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ detail: 'Internal server error' });
    }
  }
);

router.post('/:image_id/process', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const imageId = Array.isArray(req.params.image_id) ? req.params.image_id[0] : req.params.image_id;

    const db = getDatabase();
    const imageDoc = await db.collection('images').findOne(
      { image_id: imageId, user_id: user.user_id },
      { projection: { _id: 0 } }
    );

    if (!imageDoc) {
      res.status(404).json({ detail: 'Image not found' });
      return;
    }

    const image = imageDoc as unknown as ImageAsset;

    if (image.status === 'PROCESSED') {
      const response: ImageProcessResponse = {
        image_id: imageId,
        status: 'PROCESSED',
        processed_url: image.processed_url || null,
        message: 'Image already processed',
      };
      res.json(response);
      return;
    }

    if (image.status === 'PROCESSING') {
      res.status(409).json({ detail: 'Image is currently being processed' });
      return;
    }

    await db.collection('images').updateOne(
      { image_id: imageId },
      {
        $set: {
          status: 'PROCESSING',
          updated_at: new Date().toISOString(),
        },
      }
    );

    try {
      const removebgApiKey = process.env.REMOVEBG_API_KEY;
      if (!removebgApiKey) {
        await db.collection('images').updateOne(
          { image_id: imageId },
          {
            $set: {
              status: 'FAILED',
              error_message: 'Background removal service not configured',
              updated_at: new Date().toISOString(),
            },
          }
        );
        res.status(500).json({ detail: 'Background removal service not configured' });
        return;
      }

      let bgRemovedBuffer: Buffer;
      try {
        if (!removebgApiKey || removebgApiKey === 'your_removebg_api_key') {
          await db.collection('images').updateOne(
            { image_id: imageId },
            {
              $set: {
                status: 'FAILED',
                error_message: 'remove.bg API key not configured',
                updated_at: new Date().toISOString(),
              },
            }
          );
          res.status(500).json({ detail: 'remove.bg API key not configured. Please set REMOVEBG_API_KEY in backend/.env' });
          return;
        }

        const removebgResponse = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          {
            image_url: image.original_url,
            size: 'auto',
            format: 'png',
          },
          {
            headers: { 'X-Api-Key': removebgApiKey },
            responseType: 'arraybuffer',
            timeout: 60000,
          }
        );

        if (removebgResponse.status === 429) {
          await db.collection('images').updateOne(
            { image_id: imageId },
            {
              $set: {
                status: 'FAILED',
                error_message: 'Rate limit exceeded. Please try again later.',
                updated_at: new Date().toISOString(),
              },
            }
          );
          res.status(429).json({ detail: 'Rate limit exceeded' });
          return;
        }

        if (removebgResponse.status !== 200) {
          const errorMsg = `Background removal failed: ${removebgResponse.statusText}`;
          await db.collection('images').updateOne(
            { image_id: imageId },
            {
              $set: {
                status: 'FAILED',
                error_message: errorMsg,
                updated_at: new Date().toISOString(),
              },
            }
          );
          res.status(502).json({ detail: errorMsg });
          return;
        }

        bgRemovedBuffer = Buffer.from(removebgResponse.data);
      } catch (error: any) {
        console.error('remove.bg API error:', error.response?.status, error.response?.statusText, error.response?.data);
        let errorMsg = `Background removal failed: ${error.message}`;

        if (error.response?.status === 403) {
          errorMsg = 'Invalid remove.bg API key (403). Please verify your REMOVEBG_API_KEY in backend/.env is correct. Get your API key at: https://www.remove.bg/api';
        } else if (error.response?.status === 402) {
          errorMsg = 'remove.bg API credits exhausted. Please check your account at: https://www.remove.bg/api';
        } else if (error.response?.data) {
          try {
            const errorData = JSON.parse(Buffer.from(error.response.data).toString());
            errorMsg = errorData.errors?.[0]?.title || errorMsg;
          } catch {
            errorMsg = `Background removal failed: ${error.response.statusText || error.message}`;
          }
        }
        
        await db.collection('images').updateOne(
          { image_id: imageId },
          {
            $set: {
              status: 'FAILED',
              error_message: errorMsg,
              updated_at: new Date().toISOString(),
            },
          }
        );
        res.status(error.response?.status || 502).json({ detail: errorMsg });
        return;
      }

      const flippedBuffer = await sharp(bgRemovedBuffer)
        .flop(true)
        .png()
        .toBuffer();

      let processedUrl: string;
      let processedPublicId: string;
      try {
        const uploadResult = await uploadBufferToCloudinary(flippedBuffer, {
          folder: `flipcut/${user.user_id}/processed`,
          resource_type: 'image' as const,
          format: 'png',
        });

        processedUrl = uploadResult.secure_url;
        processedPublicId = uploadResult.public_id;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        await db.collection('images').updateOne(
          { image_id: imageId },
          {
            $set: {
              status: 'FAILED',
              error_message: 'Failed to upload processed image',
              updated_at: new Date().toISOString(),
            },
          }
        );
        res.status(500).json({ detail: 'Failed to upload processed image' });
        return;
      }

      await db.collection('images').updateOne(
        { image_id: imageId },
        {
          $set: {
            status: 'PROCESSED',
            processed_url: processedUrl,
            cloudinary_public_id: processedPublicId,
            error_message: null,
            updated_at: new Date().toISOString(),
          },
        }
      );

      const response: ImageProcessResponse = {
        image_id: imageId,
        status: 'PROCESSED',
        processed_url: processedUrl,
        message: 'Image processed successfully',
      };

      res.json(response);
    } catch (error: any) {
      console.error('Processing error:', error);
      await db.collection('images').updateOne(
        { image_id: imageId },
        {
          $set: {
            status: 'FAILED',
            error_message: error.message,
            updated_at: new Date().toISOString(),
          },
        }
      );
      res.status(500).json({ detail: `Processing failed: ${error.message}` });
    }
  } catch (error) {
    console.error('Process image error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const db = getDatabase();

    const items = await db
      .collection('images')
      .find(
        { user_id: user.user_id, status: { $ne: 'DELETED' } },
        { projection: { _id: 0 } }
      )
      .sort({ created_at: -1 })
      .limit(1000)
      .toArray();

    const response: ImageListResponse = {
      items: items as unknown as ImageAsset[],
    };

    res.json(response);
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.get('/:image_id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const imageId = req.params.image_id;

    const db = getDatabase();
    const imageDoc = await db.collection('images').findOne(
      { image_id: imageId, user_id: user.user_id },
      { projection: { _id: 0 } }
    );

    if (!imageDoc) {
      res.status(404).json({ detail: 'Image not found' });
      return;
    }

    res.json(imageDoc);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.delete('/:image_id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const imageId = req.params.image_id;

    const db = getDatabase();
    const imageDoc = await db.collection('images').findOne(
      { image_id: imageId, user_id: user.user_id },
      { projection: { _id: 0 } }
    );

    if (!imageDoc) {
      res.status(404).json({ detail: 'Image not found' });
      return;
    }

    const image = imageDoc as unknown as ImageAsset;

    try {
      if (image.cloudinary_public_id) {
        await cloudinary.uploader.destroy(image.cloudinary_public_id, {
          invalidate: true,
        });
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }

    await db.collection('images').updateOne(
      { image_id: imageId },
      {
        $set: {
          status: 'DELETED',
          updated_at: new Date().toISOString(),
        },
      }
    );

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
