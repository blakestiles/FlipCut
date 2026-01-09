import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { apiClient, useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Download,
  Link2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Scissors,
  FlipHorizontal2,
  Cloud,
} from "lucide-react";

const PROCESSING_STEPS = [
  { key: "upload", label: "Uploading", icon: Upload },
  { key: "removing", label: "Removing Background", icon: Scissors },
  { key: "flipping", label: "Flipping", icon: FlipHorizontal2 },
  { key: "saving", label: "Saving to Cloud", icon: Cloud },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(null); // Current processing image id
  const [processingStep, setProcessingStep] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, imageId: null });
  const [selectedImage, setSelectedImage] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch images
  const fetchImages = useCallback(async () => {
    if (!user) return;
    try {
      const response = await apiClient.get("/images");
      setImages(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user, fetchImages]);

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPEG, or WebP images.");
      return;
    }

    // Validate file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 8MB.");
      return;
    }

    setUploading(true);
    setProcessingStep(0);

    try {
      // Step 1: Upload
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await apiClient.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageId = uploadResponse.data.image_id;
      toast.success("Image uploaded! Starting processing...");

      // Step 2-4: Process (background removal + flip + cloud save)
      setProcessing(imageId);
      setProcessingStep(1);

      // Start processing
      const processResponse = await apiClient.post(`/images/${imageId}/process`);

      if (processResponse.data.status === "PROCESSED") {
        setProcessingStep(4);
        toast.success("Image processed successfully!");
        
        // Refresh images list
        await fetchImages();
      } else {
        toast.error("Processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload/processing error:", error);
      const errorMsg = error.response?.data?.detail || "Failed to process image";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      setProcessing(null);
      setProcessingStep(0);
    }
  }, [fetchImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: uploading || processing,
  });

  // Handle copy link
  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  // Handle download
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename || "processed-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.imageId) return;

    try {
      await apiClient.delete(`/images/${deleteDialog.imageId}`);
      toast.success("Image deleted");
      setDeleteDialog({ open: false, imageId: null });
      await fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  // Handle retry processing
  const handleRetry = async (imageId) => {
    setProcessing(imageId);
    setProcessingStep(1);

    try {
      const response = await apiClient.post(`/images/${imageId}/process`);
      if (response.data.status === "PROCESSED") {
        toast.success("Image processed successfully!");
        await fetchImages();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Processing failed");
    } finally {
      setProcessing(null);
      setProcessingStep(0);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6" data-testid="dashboard">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Your Images
          </h1>
          <p className="text-zinc-400">
            Upload, process, and manage your images
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div
            {...getRootProps()}
            className={`upload-zone p-12 text-center cursor-pointer ${
              isDragActive ? "drag-over" : ""
            } ${uploading || processing ? "opacity-50 cursor-not-allowed" : ""}`}
            data-testid="upload-zone"
          >
            <input {...getInputProps()} data-testid="file-input" />
            
            {uploading || processing ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    {PROCESSING_STEPS[processingStep]?.label || "Processing..."}
                  </p>
                  <div className="flex justify-center gap-2">
                    {PROCESSING_STEPS.map((step, index) => (
                      <div
                        key={step.key}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index <= processingStep
                            ? "bg-[#7c3aed]"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-[#7c3aed] mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  {isDragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-zinc-500">
                  Supports PNG, JPEG, WebP up to 8MB
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Images Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Gallery</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl skeleton" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state glass rounded-2xl">
              <ImageIcon className="w-16 h-16 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No images yet</h3>
              <p className="text-zinc-500 text-sm">
                Upload your first image to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={image.image_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="image-card glass rounded-2xl overflow-hidden group"
                    data-testid={`image-card-${image.image_id}`}
                  >
                    {/* Image Preview */}
                    <div 
                      className="aspect-square relative bg-checkered cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.processed_url || image.original_url}
                        alt={image.original_filename}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {image.status === "PROCESSED" && (
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Processed
                          </div>
                        )}
                        {image.status === "PROCESSING" && (
                          <div className="bg-[#7c3aed]/20 text-[#7c3aed] px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Processing
                          </div>
                        )}
                        {image.status === "FAILED" && (
                          <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </div>
                        )}
                        {image.status === "UPLOADED" && (
                          <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Not Processed
                          </div>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        {image.processed_url && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLink(image.processed_url);
                              }}
                              className="action-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                              title="Copy link"
                              data-testid={`copy-link-${image.image_id}`}
                            >
                              <Link2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image.processed_url, `flipcut-${image.image_id}.png`);
                              }}
                              className="action-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                              title="Download"
                              data-testid={`download-${image.image_id}`}
                            >
                              <Download className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}
                        {(image.status === "FAILED" || image.status === "UPLOADED") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetry(image.image_id);
                            }}
                            className="action-btn w-10 h-10 rounded-full bg-[#7c3aed]/50 hover:bg-[#7c3aed] flex items-center justify-center"
                            title="Retry processing"
                            data-testid={`retry-${image.image_id}`}
                          >
                            <RefreshCw className="w-4 h-4 text-white" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog({ open: true, imageId: image.image_id });
                          }}
                          className="action-btn w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center"
                          title="Delete"
                          data-testid={`delete-${image.image_id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <p className="text-sm text-white truncate mb-1">
                        {image.original_filename}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, imageId: null })}>
        <DialogContent className="bg-[#0a0a0f] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Image</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, imageId: null })}
              className="border-white/10 hover:bg-white/5 text-white"
              data-testid="cancel-delete-btn"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              data-testid="confirm-delete-btn"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-[#0a0a0f] border-white/10 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedImage?.original_filename}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              {/* Side by side comparison if processed */}
              {selectedImage.processed_url && selectedImage.original_url ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Original</p>
                    <div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden">
                      <img
                        src={selectedImage.original_url}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Processed</p>
                    <div className="aspect-square bg-checkered rounded-lg overflow-hidden">
                      <img
                        src={selectedImage.processed_url}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-checkered rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.processed_url || selectedImage.original_url}
                    alt={selectedImage.original_filename}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Actions */}
              {selectedImage.processed_url && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleCopyLink(selectedImage.processed_url)}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-white"
                    data-testid="dialog-copy-link-btn"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={() => handleDownload(selectedImage.processed_url, `flipcut-${selectedImage.image_id}.png`)}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                    data-testid="dialog-download-btn"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
