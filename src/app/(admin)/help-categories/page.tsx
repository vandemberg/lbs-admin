"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import * as faqService from "@/services/external-api/faq";
import { HelpCategory } from "@/types/faq";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().optional(),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export default function HelpCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(
    null
  );

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["help-categories"],
    queryFn: () => faqService.fetchHelpCategories({ search }),
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: null,
      description: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: faqService.createHelpCategory,
    onSuccess: () => {
      toast.success("Categoria criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["help-categories"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erro ao criar categoria");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormValues }) =>
      faqService.updateHelpCategory(id, data),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["help-categories"] });
      setIsDialogOpen(false);
      setSelectedCategory(null);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Erro ao atualizar categoria"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: faqService.deleteHelpCategory,
    onSuccess: () => {
      toast.success("Categoria removida com sucesso");
      queryClient.invalidateQueries({ queryKey: ["help-categories"] });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erro ao remover categoria");
    },
  });

  const handleCreate = () => {
    setSelectedCategory(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEdit = (category: HelpCategory) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon || null,
      description: category.description || null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: HelpCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categorias de Ajuda
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as categorias de ajuda e FAQ da plataforma.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border bg-card p-6 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-lg">{category.name}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {category.icon && (
                    <p className="text-sm text-muted-foreground">
                      Ícone: {category.icon}
                    </p>
                  )}
                </div>

                {category.slug && (
                  <p className="text-sm text-muted-foreground">
                    Slug: {category.slug}
                  </p>
                )}
                {category.description && (
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                )}
                {category.articles_count !== undefined && (
                  <b className="text-sm text-muted-foreground">
                    {category.articles_count}{" "}
                    {category.articles_count === 1 ? "artigo" : "artigos"}
                  </b>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma categoria encontrada
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...form.register("name")} className="mt-1.5" />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="slug">
                Slug (opcional - será gerado automaticamente se não fornecido)
              </Label>
              <Input
                id="slug"
                {...form.register("slug")}
                className="mt-1.5"
                placeholder="exemplo-de-slug"
              />
              {form.formState.errors.slug && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="icon">Ícone (Material Icons - opcional)</Label>
              <Input
                id="icon"
                {...form.register("icon")}
                className="mt-1.5"
                placeholder="help"
              />
              {form.formState.errors.icon && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.icon.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className="mt-1.5"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedCategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta categoria? Esta ação não pode
              ser desfeita. Categorias com artigos associados não podem ser
              removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedCategory && deleteMutation.mutate(selectedCategory.id)
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
