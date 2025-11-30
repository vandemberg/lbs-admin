"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { BookOpen, Plus, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as lbsCourse from "@/services/external-api/course";

export function SidebarNav({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => lbsCourse.fetchCourses(),
  });

  return (
    <div className={cn("flex h-full flex-col justify-between gap-8", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">LBS</h1>
        </div>

        <div className="flex flex-col gap-2">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Meus Cursos
          </p>
          {courses?.map((course) => {
            const isActive = pathname === `/courses/${course.id}`;
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <BookOpen className="h-5 w-5" />
                <span className="truncate">{course.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Configurações
        </p>
        <Link
          href="/faq"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/faq"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span>FAQ</span>
        </Link>
        <Link
          href="/help-categories"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/help-categories"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span>Categorias de Ajuda</span>
        </Link>
        <Link
          href="/badges"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/badges"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span>Badges</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Link>
      </div>
    </div>
  );
}
