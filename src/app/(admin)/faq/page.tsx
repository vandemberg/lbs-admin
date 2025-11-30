"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import * as faqService from "@/services/external-api/faq";
import { FAQ } from "@/types/faq";
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
import { useForm, Controller } from "react-hook-form";
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
  category_id: z.number().min(1, "Categoria é obrigatória"),
  question: z.string().min(1, "Pergunta é obrigatória"),
  answer: z.string().min(1, "Resposta é obrigatória"),
});

type FAQFormValues = z.infer<typeof formSchema>;

export default function FAQPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const queryClient = useQueryClient();

  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: faqService.fetchFAQs,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["help-categories"],
    queryFn: () => faqService.fetchHelpCategories({ search: "" }),
  });

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: undefined,
      question: "",
      answer: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: faqService.createFAQ,
    onSuccess: () => {
      toast.success("FAQ criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao criar FAQ");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FAQFormValues }) =>
      faqService.updateFAQ(id, data),
    onSuccess: () => {
      toast.success("FAQ atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setIsDialogOpen(false);
      setSelectedFAQ(null);
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao atualizar FAQ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: faqService.deleteFAQ,
    onSuccess: () => {
      toast.success("FAQ removida com sucesso");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setIsDeleteDialogOpen(false);
      setSelectedFAQ(null);
    },
    onError: () => {
      toast.error("Erro ao remover FAQ");
    },
  });

  const handleCreate = () => {
    setSelectedFAQ(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    form.reset({
      category_id: faq.category_id,
      question: faq.question,
      answer: faq.answer,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: FAQFormValues) => {
    if (selectedFAQ) {
      updateMutation.mutate({ id: selectedFAQ.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as perguntas frequentes da plataforma.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-lg border bg-card p-6 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {faq.category && (
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                      {faq.category.name}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(faq)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(faq)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma FAQ encontrada
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFAQ ? "Editar FAQ" : "Nova FAQ"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="category_id">Categoria</Label>
              <Controller
                name="category_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category_id && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.category_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="question">Pergunta</Label>
              <Input
                id="question"
                {...form.register("question")}
                className="mt-1.5"
              />
              {form.formState.errors.question && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.question.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="answer">Resposta</Label>
              <Textarea
                id="answer"
                {...form.register("answer")}
                className="mt-1.5"
                rows={4}
              />
              {form.formState.errors.answer && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.answer.message}
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {selectedFAQ ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta FAQ? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedFAQ && deleteMutation.mutate(selectedFAQ.id)
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

