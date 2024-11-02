"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// Simple SVG icons as components
const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

interface StatisticItem {
  title: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

interface DashboardHeaderProps {
  headerData: StatisticItem[];
  className?: string;
}

const StatCard = memo(({ stat }: { stat: StatisticItem }) => {
  const trendColor =
    stat.trend === "up"
      ? "text-green-500"
      : stat.trend === "down"
      ? "text-red-500"
      : "text-gray-500";

  const trendIcon =
    stat.trend === "up" ? (
      <ArrowUpIcon />
    ) : stat.trend === "down" ? (
      <ArrowDownIcon />
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="flex gap-4 items-start p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
      role="article"
      aria-label={`${stat.title} statistics`}
    >
      <div className="flex  gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {stat.value}
          </span>
          {stat.change && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-sm font-medium">
                {stat.change > 0 ? "+" : ""}
                {stat.change}%
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400">{stat.title}</p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = "StatCard";

export default function DashboardHeader({
  headerData,
  className = "",
}: DashboardHeaderProps) {
  return (
    <header
      className={`py-8 rounded-2xl px-6 md:px-8 lg:px-10 bg-gray-900 ${className}`}
      role="banner"
      aria-label="Dashboard Header"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Track your key metrics and performance indicators
            </p>
          </div>

          <nav
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            role="navigation"
            aria-label="Dashboard statistics"
          >
            {headerData.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
