import { Suspense } from "react";
import DashboardSideBar from "@/components/DashboardSideBar";
import Loading from "@/components/Loading";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | Marses Robotics",
  description: "View and manage your robotics dashboard",
  openGraph: {
    title: "Dashboard | Marses Robotics",
    description: "View and manage your robotics dashboard",
    type: "website",
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      role="main"
      aria-label="Dashboard Layout"
    >
      {/* Sidebar/Topbar */}
      <div
        className="h-16 w-full sm:h-screen sm:w-16 md:w-20 lg:w-24 flex-shrink-0 fixed sm:fixed top-0 left-0 right-0 sm:right-auto z-40 bg-transparent"
        role="navigation"
        aria-label="Dashboard Navigation"
      >
        <DashboardSideBar />
      </div>

      {/* Main Content */}
      <div
        className="flex-grow bg-background mt-16 sm:mt-0 sm:ml-16 md:ml-20 lg:ml-24"
        role="region"
        aria-label="Dashboard Content"
      >
        <Suspense fallback={<Loading />}>
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </Suspense>
      </div>
    </div>
  );
}
