"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  async function handleLogout() {
    router.push("/login");
  }

  useEffect(() => {
    const interceptions = externalApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
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
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar handleLogout={handleLogout} />

        <div className="flex flex-1">
          <Aside />

          <main className="flex-1 md:ml-72 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
