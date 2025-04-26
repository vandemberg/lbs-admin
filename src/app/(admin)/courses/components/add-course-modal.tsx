"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/react-query";
import * as lbsCourse from "@/services/external-api/course";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Schema de validação com Zod
const courseFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string(),
  thumbnail: z.instanceof(File).optional().nullable(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Inicializar o formulário com React Hook Form e Zod
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
    },
  });

  // Função para lidar com o upload de imagens
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    form.setValue("thumbnail", file);

    // Criar preview da imagem
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Função de submissão do formulário
  const onSubmit = async (values: CourseFormValues) => {
    setIsLoading(true);

    try {
      // Criar FormData para envio
      const submitFormData = new FormData();
      submitFormData.append("title", values.title);
      submitFormData.append("description", values.description);

      if (values.thumbnail) {
        submitFormData.append("thumbnail", values.thumbnail);
      }

      await lbsCourse.createCourse(submitFormData);

      // Atualizar a lista de cursos
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      toast.success("Curso criado com sucesso!");

      // Resetar formulário e fechar modal
      form.reset();
      setThumbnailPreview(null);
      onClose();
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      toast.error("Erro ao criar curso. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Curso</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo curso na plataforma.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Título</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Descrição</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full min-h-[100px] border rounded-md p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail" className="text-right">
                Imagem
              </Label>
              <div className="col-span-3">
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <Image
                      width={"32"}
                      height={"32"}
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="max-h-32 rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Curso"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
