"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import * as badgeService from "@/services/external-api/badge";
import { Badge, BADGE_TYPE_LABELS } from "@/types/badge";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { BadgeModal } from "./components/badge-modal";
import { Card, CardContent } from "@/components/ui/card";

export default function BadgesPage() {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);
  const [badgeToEdit, setBadgeToEdit] = useState<Badge | null>(null);

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: badgeService.fetchBadges,
  });

  const deleteMutation = useMutation({
    mutationFn: badgeService.deleteBadge,
    onSuccess: () => {
      toast.success("Badge removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
    onError: () => {
      toast.error("Erro ao remover badge.");
    },
  });

  const handleCreateClick = () => {
    setBadgeToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (badge: Badge) => {
    setBadgeToEdit(badge);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (badge: Badge) => {
    setBadgeToDelete(badge);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!badgeToDelete?.id) return;

    deleteMutation.mutate(badgeToDelete.id);
    setIsDeleteAlertOpen(false);
    setBadgeToDelete(null);
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        Inativo
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Badges</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os badges e conquistas da plataforma.
          </p>
        </div>
        <Button onClick={handleCreateClick} className="flex w-full items-center justify-center gap-2 md:w-auto">
          <Plus className="h-4 w-4" />
          Novo Badge
        </Button>
      </div>

      {/* Table */}
      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ícone</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : badges.length > 0 ? (
                  badges.map((badge) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: badge.color || "#8E2DE2" }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {badge.icon || "workspace_premium"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{badge.title}</TableCell>
                      <TableCell>{BADGE_TYPE_LABELS[badge.type] || badge.type}</TableCell>
                      <TableCell>{badge.threshold}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: badge.color }}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {badge.color}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(badge.is_active)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Editar"
                            onClick={() => handleEditClick(badge)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Remover"
                            onClick={() => handleDeleteClick(badge)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhum badge encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Badge</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja remover o badge{" "}
              <span className="font-semibold">{badgeToDelete?.title}</span>? Esta ação é
              irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Badge Modal */}
      <BadgeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBadgeToEdit(null);
        }}
        badge={badgeToEdit}
      />
    </div>
  );
}
