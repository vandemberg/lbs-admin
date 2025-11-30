"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import * as annotationService from "@/services/external-api/annotation";
import { Annotation } from "@/types/annotation";

export default function AnnotationsPage() {
  const { data: annotations = [] } = useQuery({
    queryKey: ["annotations"],
    queryFn: () => annotationService.fetchAnnotations(),
  });

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anotações</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as anotações dos vídeos.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Anotação
        </Button>
      </div>

      <div className="space-y-4">
        {annotations.length > 0 ? (
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="rounded-lg border bg-card p-6 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {annotation.timestamp && (
                    <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                      {formatTimestamp(annotation.timestamp)}
                    </span>
                  )}
                  {annotation.tag && (
                    <span className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground">
                      {annotation.tag}
                    </span>
                  )}
                </div>
                <p className="text-foreground">{annotation.content}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma anotação encontrada
          </div>
        )}
      </div>
    </div>
  );
}

