"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (publicId: string, url: string) => void;
  onUploadError?: (error: any) => void;
  buttonText?: string;
  currentImage?: string;
  onRemove?: () => void;
}

declare global {
  interface Window {
    cloudinary?: any;
  }
}

export default function CloudinaryUploadWidget({
  onUploadSuccess,
  onUploadError,
  buttonText = "Upload Image",
  currentImage = "",
  onRemove,
}: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [imagePreview, setImagePreview] = useState(currentImage);

  useEffect(() => {
    if (isReady && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          resourceType: "image",
          folder: "borderlessbuy_products",
          maxImageFileSize: 5000000, // 5MB
          sources: ["local", "camera", "url"],
          styles: {
            palette: {
              window: "#F5F5F5",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1",
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const { public_id, secure_url } = result.info;
            setImagePreview(secure_url);
            if (onUploadSuccess) onUploadSuccess(public_id, secure_url);
          }

          if (error) {
            console.error("Cloudinary upload error:", error);
            if (onUploadError) onUploadError(error);
          }
        }
      );
    }
  }, [isReady, onUploadSuccess, onUploadError]);

  const handleRemoveImage = () => {
    setImagePreview("");
    if (onRemove) onRemove();
  };

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => setIsReady(true)}
      />
      <div className="flex flex-col items-center">
        {imagePreview ? (
          <div className="relative mb-4">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-40 h-40 object-cover rounded-md border border-gray-200"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => widgetRef.current?.open()}
          className="flex items-center gap-2"
          disabled={!isReady}
        >
          <Upload className="h-4 w-4" />
          {buttonText}
        </Button>
      </div>
    </>
  );
} 