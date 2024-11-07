import React from "react";
import { BorrowersByStateProps } from "@/components/BorrowersByState";
import { MapPreviewProps } from "@/components/MapPreview";
import { NewRequestTrendProps } from "@/components/NewRequestTrend";
import { DetailsProps } from "@/components/Details";
import { ChartSkeleton } from "@/components/Skeletons";

type ComponentProps = {
  BorrowersByState: BorrowersByStateProps;
  MapPreview: MapPreviewProps;
  NewRequestTrend: NewRequestTrendProps;
  Details: DetailsProps;
};

interface DashboardComponent<T extends keyof ComponentProps> {
  name: T;
  import: () => Promise<{ default: React.ComponentType<ComponentProps[T]> }>;
  loading: () => React.JSX.Element;
  ssr: boolean;
}

export const dashboardComponents: {
  [K in keyof ComponentProps]: DashboardComponent<K>;
} = {
  BorrowersByState: {
    name: "BorrowersByState",
    import: () => import("@/components/BorrowersByState"),
    loading: () => React.createElement(ChartSkeleton),
    ssr: false,
  },
  MapPreview: {
    name: "MapPreview",
    import: () => import("@/components/MapPreview"),
    loading: () => React.createElement(ChartSkeleton),
    ssr: false,
  },
  NewRequestTrend: {
    name: "NewRequestTrend",
    import: () => import("@/components/NewRequestTrend"),
    loading: () => React.createElement(ChartSkeleton),
    ssr: false,
  },
  Details: {
    name: "Details",
    import: () => import("@/components/Details"),
    loading: () => React.createElement(ChartSkeleton),
    ssr: false,
  },
} as const;
