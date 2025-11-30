"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as lbsHttp from "@/services/external-api/course";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof formSchema>;

interface ModuleFormProps {
  courseId: number;
}

export function ModuleForm({ courseId }: ModuleFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createModule = useMutation({
    mutationFn: (data: ModuleFormValues) =>
      lbsHttp.createCourseModule(courseId, data),
    onSuccess: () => {
      toast.success("Módulo adicionado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["courses", courseId.toString()],
      });
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao adicionar módulo");
    },
  });

  const onSubmit = async (data: ModuleFormValues) => {
    setIsSubmitting(true);
    createModule.mutate(data, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Criar Novo Módulo</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Organize seu curso em seções. Os módulos podem ser reordenados a qualquer momento.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <Label htmlFor="module-title">
              Título do Módulo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="module-title"
              placeholder="Ex: Fundamentos do Marketing"
              {...form.register("name")}
              className="mt-1.5"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="md:col-span-5">
            <Label htmlFor="module-desc">Descrição do Módulo</Label>
            <Input
              id="module-desc"
              placeholder="Uma breve descrição sobre o que será ensinado"
              {...form.register("description")}
              className="mt-1.5"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

