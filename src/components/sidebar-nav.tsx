import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Home, Package, School, Users } from "lucide-react";

export function SidebarNav({
  className,
  isCollapsed,
}: {
  className?: string;
  isCollapsed?: boolean;
}) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={16} /> },
    { label: "Usuários", href: "/users", icon: <Users size={16} /> },
    { label: "Cursos", href: "/courses", icon: <Package size={16} /> },
    { label: "Instrutores", href: "/settings", icon: <School size={16} /> },
  ];

  return (
    <nav className={cn("grid gap-1", className)}>
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          className={cn(
            "flex justify-start",
            isCollapsed ? "justify-center px-2" : "px-4"
          )}
          asChild
        >
          <a href={item.href}>
            <span className={cn("mr-2", isCollapsed && "mr-0")}>
              {item.icon}
            </span>
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        </Button>
      ))}
    </nav>
  );
}
