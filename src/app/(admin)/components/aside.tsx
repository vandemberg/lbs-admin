import { SidebarNav } from "@/components/sidebar-nav";

export function Aside() {
  return (
    <aside className="fixed hidden h-full w-72 flex-col border-r border-border bg-background p-4 md:flex">
      <SidebarNav />
    </aside>
  );
}
