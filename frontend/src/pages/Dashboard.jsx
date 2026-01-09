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
  Sparkles,
  ImagePlus,
  FolderOpen,
} from "lucide-react";

// Effects
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { GridPattern, DotPattern } from "@/components/effects/GridPattern";
import { BeforeAfterSlider } from "@/components/effects/BeforeAfterSlider";
import { GlowButton } from "@/components/effects/AnimatedButtons";

const PROCESSING_STEPS = [
  { key: "upload", label: "Uploading", icon: Upload, color: "text-blue-400" },
  { key: "removing", label: "Removing Background", icon: Scissors, color: "text-violet-400" },
  { key: "flipping", label: "Flipping", icon: FlipHorizontal2, color: "text-cyan-400" },
  { key: "saving", label: "Saving to Cloud", icon: Cloud, color: "text-emerald-400" },
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
      
      // Simulate step progression for better UX
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative" data-testid="dashboard">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <DotPattern className="opacity-30" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Your Images
          </h1>
          <p className="text-zinc-400 text-lg">
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
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
              ${isDragActive 
                ? 'border-[#7c3aed] bg-[#7c3aed]/10 scale-[1.02]' 
                : 'border-white/10 hover:border-[#7c3aed]/50 hover:bg-white/[0.02]'
              }
              ${uploading || processing ? 'opacity-80 cursor-not-allowed' : ''}
            `}
            data-testid="upload-zone"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50">
              <GridPattern width={30} height={30} />
            </div>

            <div className="relative p-12 lg:p-16 text-center">
              <input {...getInputProps()} data-testid="file-input" />
              
              {uploading || processing ? (
                <div className="space-y-6">
                  {/* Processing Animation */}
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-[#7c3aed]/20 animate-ping" />
                    <div className="relative w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-[#7c3aed] animate-pulse" />
                    </div>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-4">
                    <p className="text-white font-semibold text-lg">
                      {PROCESSING_STEPS[processingStep]?.label || "Processing..."}
                    </p>
                    
                    {/* Step Progress */}
                    <div className="flex items-center justify-center gap-3">
                      {PROCESSING_STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = index === processingStep;
                        const isComplete = index < processingStep;
                        
                        return (
                          <div key={step.key} className="flex items-center">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                              ${isActive ? 'bg-[#7c3aed] scale-110' : ''}
                              ${isComplete ? 'bg-emerald-500' : ''}
                              ${!isActive && !isComplete ? 'bg-white/10' : ''}
                            `}>
                              {isComplete ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                              )}
                            </div>
                            {index < PROCESSING_STEPS.length - 1 && (
                              <div className={`w-8 h-0.5 mx-1 ${isComplete ? 'bg-emerald-500' : 'bg-white/10'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7c3aed]/20">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xl mb-2">
                    {isDragActive ? "Drop your image here" : "Drag & drop to upload"}
                  </p>
                  <p className="text-zinc-500 mb-4">
                    or click to select from your computer
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
                    <span className="px-2 py-1 rounded bg-white/5">PNG</span>
                    <span className="px-2 py-1 rounded bg-white/5">JPEG</span>
                    <span className="px-2 py-1 rounded bg-white/5">WebP</span>
                    <span className="px-2 py-1 rounded bg-white/5">Max 8MB</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Images Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-[#7c3aed]" />
              Gallery
            </h2>
            {images.length > 0 && (
              <span className="text-sm text-zinc-500">{images.length} images</span>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <SpotlightCard className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No images yet</h3>
                <p className="text-zinc-500 mb-6">
                  Upload your first image to get started
                </p>
                <GlowButton
                  onClick={() => document.querySelector('[data-testid="upload-zone"]')?.click()}
                  className="px-6 py-3"
                >
                  <ImagePlus className="w-5 h-5 mr-2" />
                  Upload Image
                </GlowButton>
              </div>
            </SpotlightCard>
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
                    className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#7c3aed]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#7c3aed]/10"
                    data-testid={`image-card-${image.image_id}`}
                  >
                    {/* Image Preview */}
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
                          <div className="bg-emerald-500/20 backdrop-blur-sm text-emerald-400 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border border-emerald-500/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Processed
                          </div>
                        )}
                        {image.status === "PROCESSING" && (
                          <div className="bg-[#7c3aed]/20 backdrop-blur-sm text-[#7c3aed] px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border border-[#7c3aed]/30">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing
                          </div>
                        )}
                        {image.status === "FAILED" && (
                          <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border border-red-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            Failed
                          </div>
                        )}
                        {image.status === "UPLOADED" && (
                          <div className="bg-amber-500/20 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border border-amber-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
                        <div className="flex items-center gap-2">
                          {image.processed_url && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyLink(image.processed_url);
                                }}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
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
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
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
                              className="w-10 h-10 rounded-full bg-[#7c3aed]/50 hover:bg-[#7c3aed] backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
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
                            className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                            title="Delete"
                            data-testid={`delete-${image.image_id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4 border-t border-white/5">
                      <p className="text-sm text-white truncate font-medium mb-1">
                        {image.original_filename}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(image.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
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
            <DialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Image
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this image? This action cannot be undone and will remove the image from cloud storage.
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
            <DialogTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#7c3aed]" />
              {selectedImage?.original_filename}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-6">
              {/* Side by side comparison if processed */}
              {selectedImage.processed_url && selectedImage.original_url ? (
                <BeforeAfterSlider
                  beforeImage={selectedImage.original_url}
                  afterImage={selectedImage.processed_url}
                  beforeLabel="Original"
                  afterLabel="Processed"
                  className="max-h-[500px]"
                />
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
                    className="border-white/10 hover:bg-white/5 text-white flex-1"
                    data-testid="dialog-copy-link-btn"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <GlowButton
                    onClick={() => handleDownload(selectedImage.processed_url, `flipcut-${selectedImage.image_id}.png`)}
                    className="flex-1"
                    data-testid="dialog-download-btn"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </GlowButton>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
