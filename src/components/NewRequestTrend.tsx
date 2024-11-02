"use client";
import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

interface TrendDataPoint {
  x: string;
  y: number;
}

interface TrendData {
  [key: string]: TrendDataPoint[];
}

interface NewRequestTrendProps {
  data?: TrendData;
  className?: string;
}

export default function NewRequestTrend({
  data,
  className = "",
}: NewRequestTrendProps) {
  const { resolvedTheme } = useTheme();

  // Create default data outside of useMemo
  const defaultData = {
    Development: Array.from({ length: 12 }, (_, i) => ({
      x: `2024-${String(i + 1).padStart(2, "0")}`,
      y: Math.floor(Math.random() * 50) + 50,
    })),
    Investment: Array.from({ length: 12 }, (_, i) => ({
      x: `2024-${String(i + 1).padStart(2, "0")}`,
      y: Math.floor(Math.random() * 40) + 40,
    })),
    "Build and Hold": Array.from({ length: 12 }, (_, i) => ({
      x: `2024-${String(i + 1).padStart(2, "0")}`,
      y: Math.floor(Math.random() * 30) + 30,
    })),
  };

  // Transform source data
  const sourceData = useMemo(() => {
    if (!data) return defaultData;

    // Check if data is an array (bar chart format)
    if (Array.isArray(data)) {
      // Transform bar data into time series format
      const categories = data.map((item) => item.name);
      const months = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, "0");
        return `2024-${month}`;
      });

      return categories.reduce((acc, category) => {
        const baseValue =
          data.find((item) => item.name === category)?.value || 0;

        // Create a trend line starting from baseValue/2 and ending at baseValue
        acc[category] = months.map((month, index) => {
          const progress = index / (months.length - 1); // 0 to 1
          const value = baseValue / 2 + (baseValue / 2) * progress;

          return {
            x: month,
            y: Math.round(value),
          };
        });

        return acc;
      }, {} as TrendData);
    }

    return data;
  }, [data]);

  // Process the data for chart
  const { transformedData, monthlyAverages } = useMemo(() => {
    try {
      // Calculate monthly averages with type checking
      const averages = Object.entries(sourceData).reduce(
        (acc, [key, values]) => {
          if (!Array.isArray(values)) {
            console.error(`Invalid data format for key: ${key}`);
            acc[key] = 0;
            return acc;
          }

          const validValues = values.filter(
            (point): point is TrendDataPoint =>
              point && typeof point.y === "number"
          );

          if (validValues.length === 0) {
            acc[key] = 0;
            return acc;
          }

          const sum = validValues.reduce((total, point) => total + point.y, 0);
          acc[key] = Math.round(sum / validValues.length);
          return acc;
        },
        {} as Record<string, number>
      );

      // Transform data for the line chart with type checking
      const transformed = Object.entries(sourceData)
        .map(([id, values]) => ({
          id,
          data: Array.isArray(values)
            ? values
                .filter(
                  (point): point is TrendDataPoint =>
                    point &&
                    typeof point.x === "string" &&
                    typeof point.y === "number"
                )
                .map((point) => ({
                  x: point.x,
                  y: point.y,
                }))
            : [],
        }))
        .filter((series) => series.data.length > 0);

      return {
        transformedData: transformed,
        monthlyAverages: averages,
      };
    } catch (error) {
      console.error("Error processing trend data:", error);
      return {
        transformedData: [],
        monthlyAverages: {},
      };
    }
  }, [sourceData]);

  const colors = ["#2563eb", "#10b981", "#f59e0b"];

  return (
    <section
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
      aria-label="New Requests Trend Analysis"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            New Requests Trend
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monthly request distribution by category
          </p>
        </div>
        <div className="flex items-center gap-2" role="toolbar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <span className="dark:text-white">⋮</span>
          </motion.button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(monthlyAverages).map(([category, average], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {category}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {average}%
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="h-[300px] w-full"
        role="img"
        aria-label="Line chart showing request trends"
      >
        {transformedData.length > 0 ? (
          <ResponsiveLine
            data={transformedData}
            margin={{ top: 20, right: 120, bottom: 20, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: 100,
              stacked: false,
            }}
            curve="monotoneX"
            axisBottom={null}
            axisLeft={{
              tickSize: 0,
              tickPadding: 15,
              tickRotation: 0,
              format: (value) => `${value}%`,
            }}
            enablePoints={false}
            colors={colors}
            lineWidth={3}
            enableArea={false}
            useMesh={true}
            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
            enableSlices={false}
            pointSize={0}
            layers={[
              "grid",
              "axes",
              "lines",
              "points",
              "slices",
              "mesh",
              ({ data, xScale, yScale }) => {
                if (!data || !xScale || !yScale) return null;

                return (
                  <g>
                    {data.map((series, index) => {
                      if (!series.data.length) return null;

                      const lastPoint = series.data[series.data.length - 1];
                      const x = (xScale as any)(lastPoint.x);
                      const y = (yScale as any)(lastPoint.y);

                      return (
                        <g key={series.id} transform={`translate(${x}, ${y})`}>
                          <rect
                            x={0}
                            y={-15}
                            width={120}
                            height={30}
                            rx={15}
                            fill={colors[index]}
                          />
                          <text
                            x={60}
                            y={0}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="white"
                            style={{
                              fontSize: "13px",
                              fontWeight: "bold",
                            }}
                          >
                            {series.id}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              },
            ]}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: resolvedTheme === "dark" ? "#9CA3AF" : "#4B5563",
                  },
                },
              },
              grid: {
                line: {
                  stroke: resolvedTheme === "dark" ? "#374151" : "#E5E7EB",
                },
              },
            }}
            role="presentation"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No data available
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
