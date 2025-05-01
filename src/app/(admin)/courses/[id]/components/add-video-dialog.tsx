"use client";

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
import * as lbsHttp from "@/services/external-api/course";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  url: z.string(),
});

export type AddVideoFormValues = z.infer<typeof formSchema>;

interface AddVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: number | null | undefined;
}

export function AddVideoDialog({
  open,
  onOpenChange,
  moduleId,
}: AddVideoDialogProps) {
  const { id: courseId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm<AddVideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
    },
  });

  const createVideo = useMutation({
    mutationFn: (data: AddVideoFormValues) => {
      if (!moduleId) {
        throw new Error("Module ID is required");
      }

      return lbsHttp.createModuleVideo(Number(courseId), moduleId, data);
    },
    onSuccess: () => {
      toast.success("O vídeo foi adicionado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast("Ocorreu um erro ao adicionar o vídeo. Tente novamente.");
    },
  });

  const onSubmit = (data: AddVideoFormValues) => {
    if (!moduleId) {
      toast.error(
        "ID do módulo não encontrado. Recarregue a página e tente novamente."
      );
      return;
    }
    createVideo.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
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
                  <FormLabel>URL do Vídeo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="URL do vídeo" />
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
              <Button type="submit" disabled={createVideo.isPending}>
                {createVideo.isPending ? "Adicionando..." : "Adicionar Vídeo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
