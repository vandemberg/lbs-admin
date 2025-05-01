"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +12.5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +7.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +4.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Lista de atividades dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`/placeholder-user-${i}.jpg`}
                      alt="User"
                    />
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
                <span className="text-sm font-medium text-green-500">
                  Online
                </span>
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
      </div> */}
    </>
  );
}
