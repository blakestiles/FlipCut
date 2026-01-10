export interface User {
  user_id: string;
  email: string;
  name: string;
  picture?: string | null;
  created_at: string;
}

export interface UserSession {
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface ImageAsset {
  image_id: string;
  user_id: string;
  original_filename: string;
  original_mime_type: string;
  original_size_bytes: number;
  original_width?: number | null;
  original_height?: number | null;
  status: "UPLOADED" | "PROCESSING" | "PROCESSED" | "FAILED" | "DELETED";
  provider: string;
  original_url?: string | null;
  bg_removed_url?: string | null;
  processed_url?: string | null;
  cloudinary_public_id?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImageUploadResponse {
  image_id: string;
  status: string;
  message: string;
}

export interface ImageProcessResponse {
  image_id: string;
  status: string;
  processed_url?: string | null;
  message: string;
}

export interface ImageListResponse {
  items: ImageAsset[];
}

export interface AuthSessionRequest {
  session_id: string;
}

export interface AuthSessionResponse {
  success: boolean;
  user: User;
}

export interface AuthMeResponse {
  user_id: string;
  email: string;
  name: string;
  picture?: string | null;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
