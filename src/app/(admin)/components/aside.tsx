import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";

export function Aside({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <aside
      className={cn(
        "fixed hidden h-full w-64 flex-col border-r bg-background md:flex",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col gap-4 py-4">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
