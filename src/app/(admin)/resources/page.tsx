"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText, Link as LinkIcon, Video } from "lucide-react";
import * as resourceService from "@/services/external-api/resource";
import { Resource } from "@/types/resource";

export default function ResourcesPage() {
  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: resourceService.fetchResources,
  });

  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
      case "file":
        return <FileText className="h-5 w-5" />;
      case "link":
        return <LinkIcon className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os recursos complementares dos cursos.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Recurso
        </Button>
      </div>

      <div className="space-y-4">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg border bg-card p-6 flex items-start justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {resource.description}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground">
                    {resource.type}
                  </span>
                </div>
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
            Nenhum recurso encontrado
          </div>
        )}
      </div>
    </div>
  );
}

