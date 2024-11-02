"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

// Type definitions
interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const sideBarItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "/icons/dashboard.svg" },
  { name: "Mail", path: "/mail", icon: "/icons/mail.svg" },
  { name: "Tasks", path: "/tasks", icon: "/icons/tasks.svg" },
  { name: "Share", path: "/share", icon: "/icons/share.svg" },
  { name: "Clock", path: "/clock", icon: "/icons/clock.svg" },
  { name: "Voice Chat", path: "/voice-chat", icon: "/icons/voice-chat.svg" },
  { name: "Settings", path: "/settings", icon: "/icons/settings.svg" },
];

export default function DashboardSideBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Call the API endpoint
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Signout failed");
      }

      // Sign out from next-auth
      await signOut({ redirect: false });

      // Redirect to signin page
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav
        className={`fixed sm:relative z-20 flex flex-row sm:flex-col items-center justify-between sm:justify-start p-4 sm:py-4 bg-white dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800 transition-all duration-300 
          
            h-[15vh] sm:h-screen w-full sm:w-auto"
          
        }`}
        aria-label="Main navigation"
      >
        {/* Logo/Toggle Button */}
        <div className="hidden sm:flex flex-shrink-0 p-2 rounded-xl md:mb-4 lg:mb-10 xl:mb-16 relative group w-16 h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Image
              src="/icons/menu.svg"
              alt="menu"
              width={32}
              height={32}
              className={`transition-transform duration-300 -rotate-45 dark:invert`}
              priority
            />
          </motion.div>
          {/* Tooltip */}
          <div className="invisible group-hover:visible absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
            Menu
          </div>
        </div>

        {/* Navigation Links Container */}
        <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center gap-4">
          {sideBarItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative group"
              aria-current={pathname === item.path ? "page" : undefined}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-colors flex items-center justify-center ${
                  pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className={`${
                    pathname === item.path || isDark ? "invert" : ""
                  }`}
                />
                <span className="sr-only">{item.name}</span>
              </motion.div>

              {/* Tooltip */}
              <div
                className={`invisible group-hover:visible absolute 
                ${
                  pathname === item.path
                    ? "  sm:left-[calc(100%+1.1rem)]"
                    : "sm:left-[calc(100%+1rem)]"
                } 
                sm:top-1/2 sm:-translate-y-1/2 
                top-[calc(100%+0.5rem)]
                px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile User Section */}
        <div className="sm:hidden flex items-center gap-3 flex-shrink-0">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={session?.user?.image || "/icons/default-avatar.svg"}
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {session?.user?.name || "Profile"}
            </motion.div>
            <div className="invisible group-hover:visible absolute top-[calc(100%+0.85rem)] left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
              {session?.user?.name || "Profile"}
            </div>
          </motion.div>

          <motion.div
            className="relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Logout"
              onClick={handleSignOut}
            >
              <Image
                src="/icons/logout.svg"
                alt="logout"
                width={30}
                height={30}
                className={isDark ? "invert" : ""}
              />
            </button>
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.div>
            <div className="invisible group-hover:visible absolute top-[calc(100%+0.55rem)] left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
              Logout
            </div>
          </motion.div>
        </div>

        {/* Desktop User Section */}
        <div className="hidden sm:flex flex-col mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mb-2 w-16 h-16 rounded-full overflow-hidden"
              role="img"
              aria-label={`${session?.user?.name || "User"}'s avatar`}
            >
              <Image
                src={session?.user?.image || "/icons/default-avatar.svg"}
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            {/* Tooltip */}
            <div className="invisible group-hover:visible absolute top-1/2 -translate-y-1/2 left-[calc(100%+0.75rem)] px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
              {session?.user?.name || "Profile"}
            </div>
          </div>
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Logout"
              onClick={handleSignOut}
            >
              <Image
                src="/icons/logout.svg"
                alt="logout"
                width={30}
                height={30}
                className={isDark ? "invert" : ""}
              />
            </motion.button>
            {/* Tooltip */}
            <div className="invisible group-hover:visible absolute top-1/2 -translate-y-1/2 left-[calc(100%+0.75rem)] px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
              Logout
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
