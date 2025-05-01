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
import { Button } from "@/components/ui/button";
import * as lbsHttp from "@/services/external-api/course";
import { toast } from "sonner";
import { Module } from "@/types/module";

const formSchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
});

export type EditModuleFormValues = z.infer<typeof formSchema>;

interface EditModuleDialogProps {
  courseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: Module | null;
}

export function EditModuleDialog({
  open,
  onOpenChange,
  module,
  courseId,
}: EditModuleDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditModuleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: module?.name || "",
      description: module?.description || "",
    },
  });

  useEffect(() => {
    if (module) {
      form.reset({
        name: module?.name || "",
        description: module?.description || "",
      });
    }
  }, [module, form]);

  const updateModule = useMutation({
    mutationFn: (data: EditModuleFormValues) => {
      if (!module) {
        throw new Error("Module is not defined");
      }

      return lbsHttp.updateCourseModule(courseId, module?.id, {
        name: data.name,
        description: data.description,
      });
    },
    onSuccess: () => {
      toast.success("O módulo foi atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar o módulo. Tente novamente.");
    },
  });

  const onSubmit = (data: EditModuleFormValues) => {
    updateModule.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Módulo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do módulo" />
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
                    <Input {...field} placeholder="Descrição do módulo" />
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
              <Button type="submit" disabled={updateModule.isPending}>
                {updateModule.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
