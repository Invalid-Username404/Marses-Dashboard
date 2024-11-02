import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { GET } from "@/app/api/dashboard/route";
import { Statistic, ChartData } from "@/types/dashboard";
import DashboardHeader from "@/components/DashboardHeader";
import { HeaderSkeleton, ChartSkeleton } from "@/components/Skeletons";

// Dynamically import heavy components
const BorrowersByState = dynamic(
  () => import("@/components/BorrowersByState"),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

const MapPreview = dynamic(() => import("@/components/MapPreview"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const NewRequestTrend = dynamic(() => import("@/components/NewRequestTrend"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const Details = dynamic(() => import("@/components/Details"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
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

      {/* First Grid - Single column on medium, two columns on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="col-span-1 min-w-0">
          <div className="bg-white rounded-lg shadow-lg min-h-[400px] lg:min-h-[500px]">
            <Suspense fallback={<ChartSkeleton />}>
              <BorrowersByState
                data={data.charts.find(
                  (c: ChartData) => c.chart_type === "pie"
                )}
              />
            </Suspense>
          </div>
        </div>
        <div className="col-span-1 min-w-0">
          <div className="bg-white rounded-lg shadow-lg min-h-[400px] lg:min-h-[500px]">
            <Suspense fallback={<ChartSkeleton />}>
              <MapPreview data={data.regions} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Second Grid - Single column on medium, two columns on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="col-span-1 min-w-0">
          <div className="bg-white rounded-lg shadow-lg min-h-[400px] lg:min-h-[500px]">
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
          </div>
        </div>
        <div className="col-span-1 min-w-0">
          <div className="bg-white rounded-lg shadow-lg min-h-[400px] lg:min-h-[500px]">
            <Suspense fallback={<ChartSkeleton />}>
              <NewRequestTrend
                data={
                  data.charts.find((c: ChartData) => c.chart_type === "bar")
                    ?.data
                }
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
