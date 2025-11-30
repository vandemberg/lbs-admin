"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import * as annotationService from "@/services/external-api/annotation";
import { Annotation } from "@/types/annotation";
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
  content: z.string().min(1, "Conteúdo é obrigatório"),
  timestamp: z.number().optional(),
  color: z.string().optional(),
  tag: z.string().optional(),
});

type AnnotationFormValues = z.infer<typeof formSchema>;

export default function VideoAnnotationsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.videoId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  const { data: annotations = [] } = useQuery({
    queryKey: ["annotations", videoId],
    queryFn: () => annotationService.fetchAnnotations(videoId),
  });

  const form = useForm<AnnotationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      timestamp: undefined,
      color: "#3713ec",
      tag: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AnnotationFormValues) =>
      annotationService.createAnnotation({
        ...data,
        video_id: videoId,
      }),
    onSuccess: () => {
      toast.success("Anotação criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["annotations", videoId] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao criar anotação");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: annotationService.deleteAnnotation,
    onSuccess: () => {
      toast.success("Anotação removida com sucesso");
      queryClient.invalidateQueries({ queryKey: ["annotations", videoId] });
      setIsDeleteDialogOpen(false);
      setSelectedAnnotation(null);
    },
    onError: () => {
      toast.error("Erro ao remover anotação");
    },
  });

  const handleCreate = () => {
    setSelectedAnnotation(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDelete = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: AnnotationFormValues) => {
    createMutation.mutate(data);
  };

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Anotações do Vídeo</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as anotações deste vídeo.
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
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
                  {annotation.color && (
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: annotation.color }}
                    />
                  )}
                </div>
                <p className="text-foreground whitespace-pre-wrap">
                  {annotation.content}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(annotation)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma anotação encontrada para este vídeo
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Anotação</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                className="mt-1.5"
                rows={4}
                placeholder="Digite sua anotação..."
              />
              {form.formState.errors.content && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timestamp">Timestamp (segundos)</Label>
                <Input
                  id="timestamp"
                  type="number"
                  {...form.register("timestamp", { valueAsNumber: true })}
                  className="mt-1.5"
                  placeholder="Ex: 120"
                />
              </div>
              <div>
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  {...form.register("tag")}
                  className="mt-1.5"
                  placeholder="Ex: Importante"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="color">Cor</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="color-picker"
                  type="color"
                  value={form.watch("color") || "#3713ec"}
                  onChange={(e) => form.setValue("color", e.target.value, { shouldValidate: true })}
                  className="w-16 h-10"
                />
                <Input
                  id="color-text"
                  {...form.register("color")}
                  className="flex-1"
                  placeholder="#3713ec"
                />
              </div>
            </div>
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
            <AlertDialogTitle>Remover Anotação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta anotação? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedAnnotation &&
                deleteMutation.mutate(selectedAnnotation.id)
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

