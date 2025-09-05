"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import lbsHttp from "@/services/external-api";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { useParams } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  url: z.string(),
  time_in_seconds: z.number(),
  transcription: z.string().optional(),
  id: z.string().optional(),
});

export type EditVideoFormValues = z.infer<typeof formSchema>;

export interface EditVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: Video | null | undefined;
  moduleId: number | null | undefined;
}

export function EditVideoDialog({
  open,
  onOpenChange,
  video,
  moduleId,
}: EditVideoDialogProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const form = useForm<EditVideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: String(video?.id || ""),
      title: video?.title || "",
      description: video?.description || "",
    },
  });

  const youtubeUrl = form.watch("url");

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    async function handleUrlChange() {
      if (!youtubeUrl) return;
      if (!youtubeUrl.includes("youtube.com")) return;

      let youtubeCode = youtubeUrl.split("v=")[1];
      youtubeCode = youtubeCode?.split("&")[0];

      const response = await axios.get("/api/youtube", {
        params: {
          code: youtubeCode,
        },
      });

      const { title, description, duration } = response.data;

      form.setValue("title", title);
      form.setValue("description", description);
      form.setValue("time_in_seconds", duration);
      form.setValue("url", youtubeCode);
    }

    handleUrlChange();
  }, [form, youtubeUrl]);

  useEffect(() => {
    if (video) {
      form.reset({
        id: String(video.id),
        title: video.title || "",
        description: video.description || "",
        url: video.url || "",
        time_in_seconds: video.time_in_seconds || 0,
        transcription: video.transcription || "",
      });
    }
  }, [video, form]);

  const updateVideo = useMutation({
    mutationFn: (data: EditVideoFormValues) => {
      if (!moduleId || !video?.id) {
        throw new Error("Module ID or Video ID is missing");
      }

      return lbsHttp.updateVideo(Number(id), moduleId, video.id, {
        title: data.title,
        description: data.description,
        url: data.url,
        time_in_seconds: data.time_in_seconds,
        transcription: data.transcription,
      } as Video);
    },
    onSuccess: () => {
      toast.success("Vídeo atualizado");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar o vídeo. Tente novamente.");
    },
  });

  const onSubmit = (data: EditVideoFormValues) => {
    if (!moduleId || !video?.id) {
      toast.error(
        "Informações do vídeo ou módulo não encontradas. Recarregue a página e tente novamente."
      );
      return;
    }
    updateVideo.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[50%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Vídeo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Título do vídeo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descrição do vídeo"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_in_seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (segundos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder={formatDuration(field.value || 0)}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transcription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transcrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Transcrição do vídeo"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateVideo.isPending}>
                {updateVideo.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
