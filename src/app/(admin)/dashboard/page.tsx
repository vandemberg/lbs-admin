"use client"

import { useState } from "react"
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Toggle */}
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
          
          {/* Desktop Sidebar Toggle */}
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
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
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
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 px-4 py-6 md:px-6 md:py-8",
          isCollapsed ? "md:ml-16" : "md:ml-64"
        )}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+12.5% em relação ao mês passado</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 45.231,89</div>
                <p className="text-xs text-muted-foreground">+7.2% em relação ao mês passado</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+4.1% em relação ao mês passado</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Lista de atividades dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder-user-${i}.jpg`} alt="User" />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">Ação realizada #{i}</p>
                        <p className="text-xs text-muted-foreground">
                          Usuário #{i} realizou uma ação no sistema há {i} hora(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Resumo do Sistema</CardTitle>
                <CardDescription>Informações gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Versão do Sistema</span>
                    <span className="text-sm font-medium">v1.2.3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status do Servidor</span>
                    <span className="text-sm font-medium text-green-500">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Último Backup</span>
                    <span className="text-sm font-medium">Hoje às 03:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuários Online</span>
                    <span className="text-sm font-medium">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carga do Servidor</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

// Componente de navegação da sidebar
function SidebarNav({ className, isCollapsed }: { className?: string; isCollapsed?: boolean }) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Usuários", href: "/dashboard/users", icon: "users" },
    { label: "Produtos", href: "/dashboard/products", icon: "package" },
    { label: "Pedidos", href: "/dashboard/orders", icon: "shopping-cart" },
    { label: "Configurações", href: "/dashboard/settings", icon: "settings" },
  ]
  
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
  )
}
