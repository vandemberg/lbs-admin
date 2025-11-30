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
import * as badgeService from "@/services/external-api/badge";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, BadgeForm, BADGE_TYPES, BADGE_TYPE_LABELS, BADGE_COLOR_OPTIONS } from "@/types/badge";
import { Switch } from "@/components/ui/switch";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge?: Badge | null;
}

// Schema de validação com Zod
const badgeFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  type: z.enum([
    BADGE_TYPES.VIDEOS_COMPLETED,
    BADGE_TYPES.COURSES_COMPLETED,
    BADGE_TYPES.HOURS_WATCHED,
    BADGE_TYPES.COMMENTS_MADE,
    BADGE_TYPES.RATINGS_GIVEN,
    BADGE_TYPES.COMMUNITY_POSTS,
  ]),
  icon: z.string().optional(),
  color: z.string(),
  threshold: z.number().min(1, "O threshold deve ser no mínimo 1"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BadgeFormValues = z.infer<typeof badgeFormSchema>;

export function BadgeModal({ isOpen, onClose, badge }: BadgeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!badge;

  // Inicializar o formulário com React Hook Form e Zod
  const form = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeFormSchema),
    defaultValues: {
      title: "",
      type: BADGE_TYPES.VIDEOS_COMPLETED,
      icon: "workspace_premium",
      color: BADGE_COLOR_OPTIONS[0].value,
      threshold: 1,
      description: "",
      is_active: true,
    },
  });

  // Preencher formulário quando editar
  useEffect(() => {
    if (badge) {
      form.reset({
        title: badge.title,
        type: badge.type as any,
        icon: badge.icon || "workspace_premium",
        color: badge.color,
        threshold: badge.threshold,
        description: badge.description || "",
        is_active: badge.is_active,
      });
    } else {
      form.reset({
        title: "",
        type: BADGE_TYPES.VIDEOS_COMPLETED,
        icon: "workspace_premium",
        color: BADGE_COLOR_OPTIONS[0].value,
        threshold: 1,
        description: "",
        is_active: true,
      });
    }
  }, [badge, form]);

  // Função de submissão do formulário
  const onSubmit = async (values: BadgeFormValues) => {
    setIsLoading(true);

    try {
      const badgeData: BadgeForm = {
        title: values.title,
        type: values.type,
        icon: values.icon,
        color: values.color,
        threshold: values.threshold,
        description: values.description,
        is_active: values.is_active,
      };

      if (isEditMode && badge) {
        await badgeService.updateBadge(badge.id, badgeData);
        toast.success("Badge atualizado com sucesso!");
      } else {
        await badgeService.createBadge(badgeData);
        toast.success("Badge criado com sucesso!");
      }

      // Atualizar a lista de badges
      queryClient.invalidateQueries({ queryKey: ["badges"] });

      // Resetar formulário e fechar modal
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar badge:", error);
      toast.error("Erro ao salvar badge. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const previewIcon = form.watch("icon") || "workspace_premium";
  const previewColor = form.watch("color") || BADGE_COLOR_OPTIONS[0].value;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Badge" : "Adicionar Novo Badge"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações do badge abaixo."
              : "Preencha os campos abaixo para criar um novo badge na plataforma."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Preview do Badge */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: previewColor }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'white' }}>
                    {previewIcon}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{form.watch("title") || "Título do Badge"}</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("description") || "Descrição do badge"}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Mestre do Foco" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(BADGE_TYPES).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {BADGE_TYPE_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone (Material Symbols)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="workspace_premium"
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("icon");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Nome do ícone do Material Symbols (ex: workspace_premium, local_fire_department)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <a
                      href="https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%231f1f1f"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Ver todos os ícones disponíveis →
                    </a>
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BADGE_COLOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: option.value }}
                            ></div>
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold (Quantidade Mínima) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Quantidade mínima necessária para desbloquear este badge
                  </p>
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
                    <textarea
                      {...field}
                      className="w-full min-h-[100px] border rounded-md p-2"
                      placeholder="Descrição opcional do badge"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Badges inativos não serão desbloqueados automaticamente
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                {isLoading
                  ? isEditMode
                    ? "Salvando..."
                    : "Criando..."
                  : isEditMode
                  ? "Salvar Alterações"
                  : "Criar Badge"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

