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
import { Button } from "@/components/ui/button";
import * as lbsHttp from "@/services/external-api/course";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string(),
});

export type AddModuleFormValues = z.infer<typeof formSchema>;

interface AddModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
}

export function AddModuleDialog({
  open,
  onOpenChange,
  courseId,
}: AddModuleDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<AddModuleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createModule = useMutation({
    mutationFn: (data: AddModuleFormValues) =>
      lbsHttp.createCourseModule(courseId, data),
    onSuccess: () => {
      toast.success("O módulo foi adicionado com sucesso.");
      queryClient.invalidateQueries({
        queryKey: ["courses", courseId.toString()],
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Ocorreu um erro ao adicionar o módulo. Tente novamente.");
    },
  });

  const onSubmit = (data: AddModuleFormValues) => {
    createModule.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Módulo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
              <Button type="submit" disabled={createModule.isPending}>
                {createModule.isPending ? "Adicionando..." : "Adicionar Módulo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
