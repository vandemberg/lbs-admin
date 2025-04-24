import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function SidebarNav({
  className,
  isCollapsed,
}: {
  className?: string;
  isCollapsed?: boolean;
}) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Usuários", href: "/users", icon: "users" },
    { label: "Produtos", href: "/products", icon: "package" },
    { label: "Pedidos", href: "/orders", icon: "shopping-cart" },
    { label: "Configurações", href: "/settings", icon: "settings" },
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
              <span className="h-5 w-5" data-icon={item.icon} />
            </span>
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        </Button>
      ))}
    </nav>
  );
}
