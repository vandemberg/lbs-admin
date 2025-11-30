"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText, Link as LinkIcon, Video, ArrowLeft } from "lucide-react";
import * as resourceService from "@/services/external-api/resource";
import { Resource } from "@/types/resource";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["pdf", "link", "file", "video"]),
  url: z.string().optional(),
});

type ResourceFormValues = z.infer<typeof formSchema>;

export default function VideoResourcesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const moduleId = Number(params.moduleId);
  const videoId = Number(params.videoId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const { data: resources = [] } = useQuery({
    queryKey: ["resources", videoId],
    queryFn: () => resourceService.fetchResources(),
    select: (data) => data.filter((r) => r.video_id === videoId),
  });

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "link",
      url: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ResourceFormValues) =>
      resourceService.createResource({
        ...data,
        video_id: videoId,
      }),
    onSuccess: () => {
      toast.success("Recurso criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["resources", videoId] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao criar recurso");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resourceService.deleteResource,
    onSuccess: () => {
      toast.success("Recurso removido com sucesso");
      queryClient.invalidateQueries({ queryKey: ["resources", videoId] });
      setIsDeleteDialogOpen(false);
      setSelectedResource(null);
    },
    onError: () => {
      toast.error("Erro ao remover recurso");
    },
  });

  const handleCreate = () => {
    setSelectedResource(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: ResourceFormValues) => {
    createMutation.mutate(data);
  };

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
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos do Vídeo</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os recursos complementares deste vídeo.
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
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
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {resource.url}
                    </a>
                  )}
                  <span className="inline-block px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground mt-2">
                    {resource.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(resource)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum recurso encontrado para este vídeo
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Recurso</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...form.register("title")}
                className="mt-1.5"
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className="mt-1.5"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) =>
                  form.setValue("type", value as Resource["type"])
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.watch("type") === "link" && (
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  {...form.register("url")}
                  className="mt-1.5"
                  placeholder="https://..."
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Recurso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este recurso? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedResource && deleteMutation.mutate(selectedResource.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

