import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Chart from "@/models/Chart";
import Statistic from "@/models/Statistic";
import Region from "@/models/Region";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    await dbConnect();

    const [charts, statistics, regions] = await Promise.all([
      Chart.find({}).lean(),
      Statistic.find({}).lean(),
      Region.find({}).lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        charts,
        statistics,
        regions,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, max-age=60",
          "Vercel-CDN-Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
