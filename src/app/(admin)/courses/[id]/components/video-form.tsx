"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Play, Link as LinkIcon, HelpCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as lbsHttp from "@/services/external-api/course";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  url: z
    .string()
    .min(1, "URL é obrigatória")
    .refine(
      (url) => youtubeUrlRegex.test(url),
      "Por favor, insira um link válido do YouTube"
    ),
  order: z.number().optional(),
});

type VideoFormValues = z.infer<typeof formSchema>;

interface VideoFormProps {
  moduleId: number;
  onSuccess?: () => void;
}

export function VideoForm({ moduleId, onSuccess }: VideoFormProps) {
  const params = useParams();
  const courseId = Number(params.id);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      order: undefined,
    },
  });

  const createVideo = useMutation({
    mutationFn: (data: VideoFormValues) =>
      lbsHttp.createModuleVideo(courseId, moduleId, {
        title: data.title,
        description: data.description,
        url: data.url,
      }),
    onSuccess: () => {
      toast.success("Vídeo adicionado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["courses", courseId.toString()],
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar vídeo");
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    setIsSubmitting(true);
    createVideo.mutate(data, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="rounded-lg bg-background p-6">
      <h3 className="font-semibold mb-6">Adicionar Nova Aula em Vídeo</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="video-url" className="flex items-center justify-between mb-1.5">
            <span>
              Link do Vídeo do YouTube <span className="text-destructive">*</span>
            </span>
            <span className="relative group">
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-popover border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Cole o link completo do vídeo
              </span>
            </span>
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="video-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              {...form.register("url")}
              className="pl-10"
            />
          </div>
          {form.formState.errors.url && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.url.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="video-title">
              Título da Aula <span className="text-destructive">*</span>
            </Label>
            <Input
              id="video-title"
              placeholder="Ex: O que é Marketing?"
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
            <Label htmlFor="video-order">Ordem no Módulo</Label>
            <Input
              id="video-order"
              type="number"
              placeholder="Ex: 2"
              {...form.register("order", { valueAsNumber: true })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="video-desc">Descrição da Aula</Label>
          <Textarea
            id="video-desc"
            placeholder="Descreva o conteúdo desta aula..."
            {...form.register("description")}
            className="mt-1.5 min-h-[100px]"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const url = form.watch("url");
              if (url) {
                window.open(url, "_blank");
              }
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Plus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Adicionando..." : "Adicionar Vídeo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

