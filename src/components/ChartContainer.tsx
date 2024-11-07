"use client";
import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  position: "left" | "right";
  onResize?: (width: number) => void;
}

export default function ChartContainer({
  children,
  title,
  position,
  onResize,
}: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const width = useMotionValue(0);
  const dragStartX = useRef(0);
  const activeSide = useRef<"left" | "right">("left");

  useEffect(() => {
    if (containerRef.current) {
      const parentWidth = containerRef.current.parentElement?.offsetWidth || 0;
      width.set(parentWidth / 2);
    }
  }, [width]);

  const handleDragStart = (
    event: React.MouseEvent<HTMLDivElement>,
    side: "left" | "right"
  ) => {
    setIsDragging(true);
    dragStartX.current = event.clientX;
    activeSide.current = side;
  };

  const handleDrag = (event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const deltaX = event.clientX - dragStartX.current;
    const newWidth =
      activeSide.current === "left"
        ? position === "left"
          ? width.get() + deltaX
          : width.get() - deltaX
        : position === "left"
        ? width.get() - deltaX
        : width.get() + deltaX;

    if (newWidth >= 300 && newWidth <= 800) {
      width.set(newWidth);
      onResize?.(newWidth);
      dragStartX.current = event.clientX;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  return (
    <motion.div
      ref={containerRef}
      className="bg-white rounded-lg shadow-lg relative"
      style={{
        width,
        minHeight: "500px",
        maxHeight: "600px",
      }}
      data-position={position}
    >
      {title && (
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}

      <div className="p-6 h-full overflow-hidden">{children}</div>

      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500/20 transition-colors z-10"
        onMouseDown={(e) => handleDragStart(e, "left")}
      />

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500/20 transition-colors z-10"
        onMouseDown={(e) => handleDragStart(e, "right")}
      />
    </motion.div>
  );
}
