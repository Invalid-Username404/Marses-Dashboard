"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import australiaTopoJson from "../../public/data/maps/australia-states.geojson";
import { Region } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatters";

interface MapPreviewProps {
  data: Region[];
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

export default function MapPreview({ data, className = "" }: MapPreviewProps) {
  const { resolvedTheme } = useTheme();
  const [tooltipContent, setTooltipContent] = useState("");
  const [position, setPosition] = useState({
    coordinates: [135, -28.5] as [number, number],
    zoom: 3,
  });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const getStateColor = useCallback(
    (value: number, stateName: string) => {
      // Find the corresponding state in the chartData to get its color
      const stateData = data.find((d) => d.name === stateName);
      if (!stateData) return COLOR_SCHEME[COLOR_SCHEME.length - 1];

      // Get the state's index to use the same color as in BorrowersByState
      const stateIndex = data.findIndex((d) => d.name === stateName);
      return COLOR_SCHEME[stateIndex % COLOR_SCHEME.length];
    },
    [data]
  );

  const getMostRecentValue = useCallback((values: Region["values"]) => {
    if (!values?.length) return 0;
    return values.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0].value;
  }, []);

  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
  }, [position.zoom]);

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
  }, [position.zoom]);

  const handleReset = useCallback(() => {
    setPosition({
      coordinates: [135, -28.5],
      zoom: 3,
    });
  }, []);

  return (
    <section
      className={`flex flex-col rounded-2xl bg-white dark:bg-gray-800 h-full ${className}`}
      aria-label="Interactive map of Australia showing borrower distribution"
    >
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Map Preview
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
              priority
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

      <div className="relative flex-1 p-4">
        <div
          className="absolute left-4 bottom-4 flex flex-col gap-2 z-10"
          role="group"
          aria-label="Map controls"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomIn}
            className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            aria-label="Zoom in"
            disabled={position.zoom >= 4}
          >
            +
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomOut}
            className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            aria-label="Zoom out"
            disabled={position.zoom <= 1}
          >
            -
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReset}
            className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset map view"
          >
            ⤢
          </motion.button>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 280,
          }}
          className="w-full h-full min-h-[400px]"
          data-tooltip-id="map-tooltip"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            maxZoom={4}
          >
            <Geographies geography={australiaTopoJson}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateData = data.find(
                    (d) => d.name === geo.properties.STATE_NAME
                  );
                  const currentValue = getMostRecentValue(
                    stateData?.values || []
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(
                        currentValue,
                        geo.properties.STATE_NAME
                      )}
                      role="region"
                      aria-label={`${
                        geo.properties.STATE_NAME
                      }: $${currentValue.toFixed(2)}M`}
                      tabIndex={0}
                      onMouseEnter={() => {
                        setTooltipVisible(true);
                        setTooltipContent(
                          `${
                            geo.properties.STATE_NAME
                          }\n$${currentValue.toFixed(2)}M`
                        );
                      }}
                      onMouseLeave={() => {
                        setTooltipVisible(false);
                        setTooltipContent("");
                      }}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 250ms",
                        },
                        hover: {
                          outline: "none",
                          fill: getStateColor(
                            currentValue,
                            geo.properties.STATE_NAME
                          ),
                          opacity: 0.8,
                          cursor: "pointer",
                        },
                        pressed: {
                          outline: "none",
                          fill: getStateColor(
                            currentValue,
                            geo.properties.STATE_NAME
                          ),
                          opacity: 0.7,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <div
          className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg"
          role="legend"
          aria-label="Map legend"
        >
          {data
            .map((state) => {
              // Calculate percentage
              const totalValue = data.reduce(
                (sum, s) => sum + getMostRecentValue(s.values),
                0
              );
              const stateValue = getMostRecentValue(state.values);
              const percentage =
                totalValue > 0 ? (stateValue / totalValue) * 100 : 0;

              return {
                name: state.name,
                percentage,
                color:
                  COLOR_SCHEME[
                    data.findIndex((s) => s.name === state.name) %
                      COLOR_SCHEME.length
                  ],
              };
            })
            // Sort by percentage in descending order
            .sort((a, b) => b.percentage - a.percentage)
            .map(({ name, percentage, color }) => (
              <div
                key={name}
                className="flex items-center gap-2"
                role="presentation"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-sm dark:text-white">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            ))}
        </div>

        <AnimatePresence>
          {tooltipVisible && tooltipContent && (
            <Tooltip
              id="map-tooltip"
              content={tooltipContent}
              place="top"
              isOpen={tooltipVisible}
              className="!bg-white dark:!bg-gray-800 !text-black dark:!text-white !px-6 !py-3 !rounded-xl !shadow-lg !text-lg !font-bold !border !border-gray-200 dark:!border-gray-700"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1000,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
