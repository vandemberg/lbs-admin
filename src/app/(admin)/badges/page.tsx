"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import * as badgeService from "@/services/external-api/badge";
import { Badge } from "@/types/badge";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

export default function BadgesPage() {
  const { data: badges = [] } = useQuery({
    queryKey: ["badges"],
    queryFn: badgeService.fetchBadges,
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Badges</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os badges e conquistas da plataforma.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Badge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <div
              key={badge.id}
              className="rounded-lg border bg-card p-6 flex flex-col items-center text-center"
            >
              <div
                className="h-16 w-16 rounded-full mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: badge.color || "#3713ec" }}
              >
                {badge.icon || "🏆"}
              </div>
              <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {badge.description}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum badge encontrado
          </div>
        )}
      </div>
    </div>
  );
}

