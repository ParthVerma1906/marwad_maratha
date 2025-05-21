
import React, { useRef } from 'react';
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (base64String: string) => void;
  className?: string;
}

const ImageUploader = ({ imageUrl, onImageChange, className = "" }: ImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Image must be less than 2MB"
        });
        return;
      }
      
      // Convert to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = event.target.result.toString();
          onImageChange(base64String);
          toast({
            title: "Image updated",
            description: "Image will be saved when you update the product"
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get image preview URL with consistent handling
  const getImagePreviewUrl = () => {
    if (!imageUrl || imageUrl === "/placeholder.svg") {
      return "/placeholder.svg";
    } else if (imageUrl.startsWith('data:image/')) {
      return imageUrl; // It's already a base64 image
    } else if (imageUrl.startsWith('/src/assets/')) {
      return `/images/${imageUrl.split('/').pop()}`;
    }
    return imageUrl;
  };

  return (
    <>
      <div 
        onClick={triggerFileInput}
        className={`mb-2 w-full h-32 border border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 ${className}`}
      >
        {imageUrl && imageUrl !== '/placeholder.svg' ? (
          <div className="relative w-full h-full">
            <img 
              src={getImagePreviewUrl()} 
              alt="Product preview" 
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error("Product image failed to load:", target.src);
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <Upload size={24} className="text-white" />
            </div>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Click to upload image</span>
          </>
        )}
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImageUploader;
