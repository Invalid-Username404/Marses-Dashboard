"use client";
import { useMemo } from "react";
import { ResponsiveStream } from "@nivo/stream";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

interface DetailsProps {
  data: Array<{
    title: string;
    value: string;
  }>;
  className?: string;
}

interface StatCard {
  title: string;
  value: string;
  trend?: number;
  icon?: string;
}

export default function Details({ data, className = "" }: DetailsProps) {
  const { resolvedTheme } = useTheme();

  // Memoized data transformations
  const dataExample = useMemo<StatCard[]>(
    () => [
      {
        title: "Opened Requests",
        value: "22.8k",
        trend: 12,
        icon: "/icons/requests.svg",
      },
      { title: "Engaged", value: "67%", trend: -5, icon: "/icons/engaged.svg" },
      { title: "EOI Sent", value: "24%", trend: 8, icon: "/icons/sent.svg" },
    ],
    []
  );

  const streamData = useMemo(() => {
    return Array.from({ length: 50 }, (_, index) => {
      const date = new Date(2024, 0, index + 1);
      let openedRequests;

      if (index < 10 || index >= 40) {
        openedRequests = 5 + Math.floor(Math.random() * 3);
      } else {
        openedRequests = 30 + Math.floor(Math.random() * 15);
      }

      return {
        "Opened Requests": openedRequests,
        Engaged: 45 + Math.floor(Math.random() * 15),
        "EOI Sent": Math.max(5, 25 - index / 2),
        date: date.toISOString().split("T")[0],
      };
    });
  }, []);

  return (
    <section
      className={`flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}
      aria-label="Details Dashboard Section"
    >
      {/* Header */}
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Details
        </h2>
        <div className="flex items-center gap-2" role="toolbar">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="View calendar"
          >
            <Image
              src="/icons/calender.svg"
              alt=""
              width={24}
              height={24}
              className={resolvedTheme === "dark" ? "invert" : ""}
            />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <span className="dark:text-white">⋮</span>
          </button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {dataExample.map((item) => (
          <motion.div
            key={item.title}
            className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {item.title}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
              {item.trend && (
                <span
                  className={`text-sm ${
                    item.trend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.trend > 0 ? "+" : ""}
                  {item.trend}%
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stream Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveStream
          valueFormat={(value) => `${value}%`}
          data={streamData}
          keys={["Opened Requests", "Engaged", "EOI Sent"]}
          margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          curve="natural"
          offsetType="silhouette"
          colors={["#7db3fe", "#2c84fe", "#4f98fe"]}
          fillOpacity={0.85}
          borderColor={{ theme: "background" }}
          dotSize={8}
          dotColor={{ from: "color" }}
          dotBorderWidth={2}
          dotBorderColor={{ from: "color", modifiers: [["darker", 0.7]] }}
          animate={true}
          motionConfig="stiff"
        />
      </div>

      {/* Legends below the chart */}
      <div className="flex justify-center gap-8 mt-4">
        {["Opened Requests", "Engaged", "EOI Sent"].map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ["#2171b5", "#4292c6", "#6baed6"][index],
              }}
            />
            <span className="text-sm text-gray-600">{key}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
