import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { GET } from "@/app/api/dashboard/route";
import { Statistic, ChartData } from "@/types/dashboard";
import DashboardHeader from "@/components/DashboardHeader";
import { ChartSkeleton, HeaderSkeleton } from "@/components/Skeletons";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import ChartContainer from "@/components/dashboard/ChartContainer";
import { dashboardComponents } from "@/config/dashboard";

// Dynamically import components
const BorrowersByState = dynamic(dashboardComponents.BorrowersByState.import, {
  loading: dashboardComponents.BorrowersByState.loading,
  ssr: dashboardComponents.BorrowersByState.ssr,
});

const MapPreview = dynamic(dashboardComponents.MapPreview.import, {
  loading: dashboardComponents.MapPreview.loading,
  ssr: dashboardComponents.MapPreview.ssr,
});

const NewRequestTrend = dynamic(dashboardComponents.NewRequestTrend.import, {
  loading: dashboardComponents.NewRequestTrend.loading,
  ssr: dashboardComponents.NewRequestTrend.ssr,
});

const Details = dynamic(dashboardComponents.Details.import, {
  loading: dashboardComponents.Details.loading,
  ssr: dashboardComponents.Details.ssr,
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "Dashboard - Marses Robotics",
  description:
    "View and manage your robotics dashboard with real-time statistics and insights",
  openGraph: {
    title: "Dashboard - Marses Robotics",
    description: "Real-time robotics dashboard with comprehensive analytics",
    type: "website",
  },
};

// Enhanced cache function with error handling and typing
const getDashboardData = unstable_cache(
  async () => {
    try {
      const response = await GET();
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch dashboard data");
      }

      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        success: false,
        charts: [],
        statistics: [],
        regions: [],
      };
    }
  },
  ["dashboard-data"],
  {
    revalidate: 60,
    tags: ["dashboard"],
  }
);

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <section
      className="flex flex-col p-4 md:p-6 lg:p-8 space-y-6"
      aria-label="Dashboard Content"
    >
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader
          headerData={data.statistics.filter(
            (stat: Statistic) =>
              stat.title === "Creating and submitting your EOI" ||
              stat.title === "Approval of new requests"
          )}
        />
      </Suspense>

      <DashboardGrid>
        <ChartContainer>
          <Suspense fallback={<ChartSkeleton />}>
            <BorrowersByState
              data={data.charts.find((c: ChartData) => c.chart_type === "pie")}
            />
          </Suspense>
        </ChartContainer>
        <ChartContainer>
          <Suspense fallback={<ChartSkeleton />}>
            <MapPreview data={data.regions} />
          </Suspense>
        </ChartContainer>
      </DashboardGrid>

      <DashboardGrid>
        <ChartContainer>
          <Suspense fallback={<ChartSkeleton />}>
            <Details
              data={data.statistics.filter(
                (stat: Statistic) =>
                  stat.title === "Opened Request" ||
                  stat.title === "Engaged" ||
                  stat.title === "EOI Sent"
              )}
            />
          </Suspense>
        </ChartContainer>
        <ChartContainer>
          <Suspense fallback={<ChartSkeleton />}>
            <NewRequestTrend
              data={
                data.charts.find((c: ChartData) => c.chart_type === "bar")?.data
              }
            />
          </Suspense>
        </ChartContainer>
      </DashboardGrid>
    </section>
  );
}
