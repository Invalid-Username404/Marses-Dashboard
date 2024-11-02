"use client";
import { useState } from "react";
import Image from "next/image";

interface ProfilePictureProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
}

export default function ProfilePicture({
  onImageSelect,
  currentImage,
}: ProfilePictureProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    onImageSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={previewUrl || currentImage || "/icons/default-avatar.svg"}
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>
      <label className="cursor-pointer px-4 py-2 text-sm text-blue-600 hover:text-blue-500 transition-colors">
        Upload Photo
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
}
