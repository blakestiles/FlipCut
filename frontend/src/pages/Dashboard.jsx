import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { apiClient, useAuth } from "@/App";
import { Button } from "@/components/ui/button";
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
  Sparkles,
  FolderOpen,
} from "lucide-react";

import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

const PROCESSING_STEPS = [
  { key: "upload", label: "Uploading", icon: Upload },
  { key: "removing", label: "Removing Background", icon: Sparkles },
  { key: "flipping", label: "Flipping", icon: RefreshCw },
  { key: "saving", label: "Saving", icon: CheckCircle },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, imageId: null });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

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

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPEG, or WebP images.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 8MB.");
      return;
    }

    setUploading(true);
    setProcessingStep(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await apiClient.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageId = uploadResponse.data.image_id;
      toast.success("Image uploaded! Starting processing...");

      setProcessing(imageId);
      setProcessingStep(1);
      await new Promise(r => setTimeout(r, 500));
      setProcessingStep(2);
      
      const processResponse = await apiClient.post(`/images/${imageId}/process`);
      
      setProcessingStep(3);
      await new Promise(r => setTimeout(r, 300));

      if (processResponse.data.status === "PROCESSED") {
        setProcessingStep(4);
        toast.success("Image processed successfully!");
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

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-black" data-testid="dashboard">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none dot-pattern opacity-30" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
              Your Images
            </h1>
            <p className="text-zinc-500">
              Upload, process, and manage your images
            </p>
          </div>
        </ScrollReveal>

        {/* Upload Zone */}
        <ScrollReveal delay={0.1}>
          <div
            {...getRootProps()}
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer mb-12
              ${isDragActive 
                ? 'border-white bg-zinc-900/50 scale-[1.02]' 
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30'
              }
              ${uploading || processing ? 'opacity-80 cursor-not-allowed' : ''}
            `}
            data-testid="upload-zone"
          >
            <div className="p-12 lg:p-16 text-center">
              <input {...getInputProps()} data-testid="file-input" />
              
              {uploading || processing ? (
                <div className="space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
                    <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-white font-medium text-lg">
                      {PROCESSING_STEPS[processingStep]?.label || "Processing..."}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2">
                      {PROCESSING_STEPS.map((step, index) => (
                        <div
                          key={step.key}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index <= processingStep ? 'bg-white' : 'bg-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium text-lg mb-2">
                    {isDragActive ? "Drop your image here" : "Drag & drop to upload"}
                  </p>
                  <p className="text-zinc-600 text-sm mb-4">
                    or click to select from your computer
                  </p>
                  <div className="flex items-center justify-center gap-3 text-xs text-zinc-600">
                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">PNG</span>
                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">JPEG</span>
                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">WebP</span>
                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">Max 8MB</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery */}
        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-zinc-500" />
              Gallery
            </h2>
            {images.length > 0 && (
              <span className="text-sm text-zinc-600">{images.length} images</span>
            )}
          </div>
        </ScrollReveal>
          
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <SpotlightCard className="py-16 bg-zinc-900/50 border-zinc-800" spotlightColor="rgba(255,255,255,0.03)">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No images yet</h3>
              <p className="text-zinc-600 text-sm">
                Upload your first image to get started
              </p>
            </div>
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.image_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                  data-testid={`image-card-${image.image_id}`}
                >
                  <div 
                    className="aspect-square relative bg-checkered cursor-pointer overflow-hidden"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.processed_url || image.original_url}
                      alt={image.original_filename}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {image.status === "PROCESSED" && (
                        <div className="bg-zinc-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 border border-zinc-700">
                          <CheckCircle className="w-3 h-3" />
                          Done
                        </div>
                      )}
                      {image.status === "PROCESSING" && (
                        <div className="bg-zinc-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 border border-zinc-700">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing
                        </div>
                      )}
                      {image.status === "FAILED" && (
                        <div className="bg-red-900/80 backdrop-blur-sm text-red-300 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 border border-red-800">
                          <XCircle className="w-3 h-3" />
                          Failed
                        </div>
                      )}
                      {image.status === "UPLOADED" && (
                        <div className="bg-zinc-900/80 backdrop-blur-sm text-zinc-400 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 border border-zinc-700">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </div>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                      {image.processed_url && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopyLink(image.processed_url); }}
                            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all"
                            title="Copy link"
                            data-testid={`copy-link-${image.image_id}`}
                          >
                            <Link2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(image.processed_url, `flipcut-${image.image_id}.png`); }}
                            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all"
                            title="Download"
                            data-testid={`download-${image.image_id}`}
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                        </>
                      )}
                      {(image.status === "FAILED" || image.status === "UPLOADED") && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRetry(image.image_id); }}
                          className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center transition-all"
                          title="Retry"
                          data-testid={`retry-${image.image_id}`}
                        >
                          <RefreshCw className="w-4 h-4 text-black" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, imageId: image.image_id }); }}
                        className="w-10 h-10 rounded-full bg-red-900/50 hover:bg-red-900 flex items-center justify-center transition-all"
                        title="Delete"
                        data-testid={`delete-${image.image_id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-zinc-800">
                    <p className="text-sm text-white truncate font-medium">{image.original_filename}</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {new Date(image.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, imageId: null })}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Image</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Are you sure? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, imageId: null })} className="border-zinc-700 hover:bg-zinc-800 text-white" data-testid="cancel-delete-btn">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white" data-testid="confirm-delete-btn">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedImage?.original_filename}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              {selectedImage.processed_url && selectedImage.original_url ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-600 mb-2">Original</p>
                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                      <img src={selectedImage.original_url} alt="Original" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-600 mb-2">Processed</p>
                    <div className="aspect-square bg-checkered rounded-lg overflow-hidden">
                      <img src={selectedImage.processed_url} alt="Processed" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-checkered rounded-lg overflow-hidden">
                  <img src={selectedImage.processed_url || selectedImage.original_url} alt={selectedImage.original_filename} className="w-full h-full object-contain" />
                </div>
              )}
              
              {selectedImage.processed_url && (
                <div className="flex gap-3">
                  <Button onClick={() => handleCopyLink(selectedImage.processed_url)} variant="outline" className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white" data-testid="dialog-copy-link-btn">
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={() => handleDownload(selectedImage.processed_url, `flipcut-${selectedImage.image_id}.png`)} className="flex-1 bg-white hover:bg-zinc-200 text-black" data-testid="dialog-download-btn">
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
