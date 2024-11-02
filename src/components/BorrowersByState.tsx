"use client";

import { ResponsivePie } from "@nivo/pie";
import Image from "next/image";
import { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import { ChartData } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatters";

interface BorrowersByStateProps {
  data?: ChartData;
  className?: string;
}

const COLOR_SCHEME = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
] as const;

export default function BorrowersByState({
  data,
  className = "",
}: BorrowersByStateProps) {
  const { resolvedTheme } = useTheme();
  const [activeId, setActiveId] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item, index) => {
      const sortedValues = [...(item.values || [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 1);

      return {
        id: item.name,
        label: item.name,
        value: sortedValues[0]?.value || item.value || 0,
        color: COLOR_SCHEME[index % COLOR_SCHEME.length],
      };
    });
  }, [data]);

  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const handleLegendClick = useCallback((item: (typeof chartData)[0]) => {
    setActiveId((prevId) => (prevId === item.id ? null : item.id));
  }, []);

  return (
    <section
      className={`h-full w-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}
      aria-label="Borrowers by State Distribution"
    >
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Borrowers by State
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
            <span className="dark:text-white" aria-hidden="true">
              ⋮
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="relative w-full md:w-2/3 min-h-[300px] md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsivePie
                data={chartData}
                innerRadius={0.85}
                startAngle={120}
                endAngle={-120}
                padAngle={2.5}
                cornerRadius={15}
                activeOuterRadiusOffset={8}
                colors={{ datum: "data.color" }}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                enableArcLabels={false}
                isInteractive={true}
                activeId={activeId}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                layers={[
                  "arcs",
                  "arcLabels",
                  "arcLinkLabels",
                  "legends",
                  ({ centerX, centerY }) => {
                    const formattedValue = formatCurrency(totalAmount).replace(
                      "$",
                      ""
                    );
                    return (
                      <g transform={`translate(${centerX},${centerY})`}>
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          y="-12"
                          className="text-2xl sm:text-3xl md:text-4xl font-bold"
                          style={{
                            fill: resolvedTheme === "dark" ? "#fff" : "#000",
                          }}
                        >
                          ${formattedValue} M
                        </text>
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          y="15"
                          className="text-sm sm:text-base"
                          style={{
                            fill: resolvedTheme === "dark" ? "#fff" : "#000",
                            opacity: 0.7,
                          }}
                        >
                          Total Amount
                        </text>
                      </g>
                    );
                  },
                ]}
                theme={{
                  text: {
                    fill: resolvedTheme === "dark" ? "#fff" : "#000",
                  },
                  tooltip: {
                    container: {
                      background:
                        resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
                      color: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                      fontSize: "14px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    },
                  },
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full md:w-1/3 flex flex-row md:flex-col flex-wrap lg:mr-2 justify-center md:justify-center md:pr-4">
          {chartData.map((item) => (
            <motion.button
              key={item.id}
              className={`flex items-center justify-between lg:w-[180px] lg:mr-2 py-3  rounded-lg transition-colors
                ${
                  activeId === item.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }
                w-full max-w-[280px]
              `}
              onClick={() => handleLegendClick(item)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3  rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium  dark:text-white text-sm whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              <div className="flex-1 mx-4  border-b border-dotted border-gray-300 dark:border-gray-600" />
              <span className="font-semibold dark:text-white text-sm whitespace-nowrap">
                ${formatCurrency(item.value).replace("$", "")} M
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
