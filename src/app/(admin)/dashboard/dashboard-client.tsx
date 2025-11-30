"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardPeriod,
  DashboardResponse,
  EngagementPoint,
  TopStudent,
} from "@/types/dashboard";
import { fetchDashboardMetrics } from "@/services/external-api/dashboard";

const timePeriods: { label: string; value: DashboardPeriod }[] = [
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Este mês", value: "month" },
  { label: "Desde o início", value: "all" },
];

const ratingColors: Record<number, string> = {
  5: "bg-custom-green",
  4: "bg-lime-500",
  3: "bg-yellow-500",
  2: "bg-orange-500",
  1: "bg-destructive",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

export function DashboardClient() {
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>("30d");

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("pt-BR"),
    []
  );
  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    []
  );

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery<DashboardResponse>({
    queryKey: ["dashboard", selectedPeriod],
    queryFn: () => fetchDashboardMetrics(selectedPeriod),
  });

  const periodLabel =
    timePeriods.find((period) => period.value === selectedPeriod)?.label ??
    "período selecionado";

  const statCards = [
    {
      label: "Tempo Médio Assistido",
      value: data
        ? `${decimalFormatter.format(data.summary.averageWatchMinutes)} min`
        : "--",
      helper: "Média por vídeo concluído",
    },
    {
      label: "Taxa de Conclusão",
      value: data
        ? `${decimalFormatter.format(data.summary.completionRate)}%`
        : "--",
      helper: "Finalizações registradas no período",
    },
    {
      label: "Reações Positivas",
      value: data
        ? numberFormatter.format(data.summary.positiveReactions)
        : "--",
      helper: "Avaliações com 4 ou 5 estrelas",
    },
    {
      label: "Total de Alunos",
      value: data ? numberFormatter.format(data.summary.totalStudents) : "--",
      helper: "Alunos que consumiram conteúdo",
    },
  ];

  const engagementData = data?.engagement ?? [];
  const maxEngagementCount = Math.max(
    ...engagementData.map((point) => point.count),
    1
  );

  const xAxisLabels = buildXAxisLabels(engagementData);

  const ratings = data?.ratings;
  const ratingDistribution =
    ratings?.distribution ??
    [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: 0,
      count: 0,
    }));

  const topStudents: TopStudent[] = data?.topStudents ?? [];

  if (isLoading && !data) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : "Erro ao carregar a dashboard.";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">
            Painel do Instrutor
          </h1>
          <p className="text-sm text-muted-foreground">
            {periodLabel} · dados em tempo real
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {period.label}
            </button>
          ))}
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">
                Engajamento ao Longo do Tempo
              </h3>
              <p className="text-sm text-muted-foreground">
                Visualizações · {periodLabel}
              </p>
              <div className="mt-4 flex h-64 w-full items-end justify-center">
                {engagementData.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-secondary/40 text-sm text-muted-foreground">
                    Sem dados no período selecionado
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {engagementData.map((point) => {
                      const height = Math.max(
                        (point.count / maxEngagementCount) * 100,
                        2
                      );
                      return (
                        <div
                          key={point.date}
                          className="flex-1 rounded-t bg-primary/60"
                          style={{ height: `${height}%` }}
                          title={`${dateFormatter.format(
                            new Date(point.date)
                          )} • ${point.count} visualizações`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              {xAxisLabels.length > 0 && (
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  {xAxisLabels.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Feedback das Aulas</h3>
              <p className="text-sm text-muted-foreground">
                Distribuição das avaliações recebidas
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold">
                    {ratings ? ratings.average.toFixed(1) : "--"}
                  </p>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl">
                        {ratings && i < Math.round(ratings.average) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ratings
                      ? `Baseado em ${numberFormatter.format(
                          ratings.totalReviews
                        )} avaliações`
                      : "Sem avaliações neste período"}
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {rating.stars} estrelas
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-secondary">
                        <div
                          className={`h-2 rounded-full ${ratingColors[rating.stars]}`}
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-medium">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Alunos Mais Ativos</h3>
              <p className="text-sm text-muted-foreground">
                Ranking por aulas concluídas
              </p>
              <ul className="mt-4 space-y-4">
                {topStudents.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    Nenhum aluno concluiu aulas no período selecionado.
                  </li>
                )}
                {topStudents.map((student) => (
                  <li key={student.userId} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                      {getInitials(student.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.completedLabel}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {student.progressPercent}%
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/20">
                Ver todos os alunos
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function buildXAxisLabels(data: EngagementPoint[]): string[] {
  if (data.length === 0) {
    return [];
  }

  if (data.length <= 4) {
    return data.map((point) => dateFormatter.format(new Date(point.date)));
  }

  const total = data.length - 1;
  const indexes = [
    0,
    Math.floor(total / 3),
    Math.floor((total * 2) / 3),
    total,
  ];

  return indexes.map((idx) =>
    dateFormatter.format(new Date(data[idx]?.date ?? data[0].date))
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

