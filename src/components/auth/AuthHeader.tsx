import Image from "next/image";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Image
          src="/icons/logo.svg"
          alt="Marses Robotics logo"
          width={80}
          height={80}
          className="w-auto h-auto"
          priority
        />
      </motion.div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
