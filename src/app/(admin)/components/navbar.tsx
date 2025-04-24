import { SidebarNav } from "@/components/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";

interface NavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  handleLogout: () => Promise<void>;
}

export function Navbar({ isCollapsed, setIsCollapsed, handleLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex flex-col gap-4 py-4">
              <div className="px-4 text-xl font-bold">Admin Dashboard</div>
              <SidebarNav className="px-2" />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="text-xl font-bold">Admin Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex">Usuário</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Perfil
            </DropdownMenuItem>
            <Button className="m-0 p-0" onClick={handleLogout} variant="link">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
