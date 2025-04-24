"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Aside } from "./components/aside";
import { Navbar } from "./components/navbar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { externalApi } from "@/lib/axios";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    router.push("/login");
  }

  useEffect(() => {
    const interceptions = externalApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      externalApi.interceptors.response.eject(interceptions);
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Navbar
          handleLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div className="flex flex-1">
          <Aside isCollapsed={isCollapsed} />

          <main
            className={cn(
              "flex-1 px-4 py-6 md:px-6 md:py-8",
              isCollapsed ? "md:ml-16" : "md:ml-64"
            )}
          >
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
