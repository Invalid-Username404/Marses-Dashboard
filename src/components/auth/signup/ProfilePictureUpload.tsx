import { useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProfilePictureUploadProps {
  currentImage: File | null;
  onImageSelect: (file: File | null) => void;
}

export default function ProfilePictureUpload({
  currentImage,
  onImageSelect,
}: ProfilePictureUploadProps) {
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onImageSelect(file);
    },
    [onImageSelect]
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800"
      >
        {currentImage ? (
          <Image
            src={URL.createObjectURL(currentImage)}
            alt="Profile preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </motion.div>

      <label className="cursor-pointer">
        <span className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
          {currentImage ? "Change photo" : "Upload photo"}
        </span>
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
