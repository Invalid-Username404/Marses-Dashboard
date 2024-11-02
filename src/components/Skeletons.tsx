"use client";
import { motion } from "framer-motion";

export function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center py-4">
      <motion.div
        className="h-10 w-48 bg-gray-200 rounded-lg"
        animate={{
          opacity: [0.5, 1, 0.5],
          backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="flex gap-16">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-2 items-start">
            <motion.div
              className="h-10 w-20 bg-gray-200 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
                backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
            <motion.div
              className="h-6 w-24 bg-gray-200 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
                backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <motion.div
          className="h-6 w-32 bg-gray-200 rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
            backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="h-8 w-8 bg-gray-200 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
                backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
      <motion.div
        className="h-[300px] bg-gray-200 rounded-lg"
        animate={{
          opacity: [0.5, 1, 0.5],
          backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
