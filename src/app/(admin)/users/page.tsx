"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { fetchUsers } from "@/services/external-api/user";
import { useQuery } from "@tanstack/react-query";
import { EditUserModal } from "./components/edit-user-modal";
import { ChangePasswordUserModal } from "./components/change-password-user-modal";
import { RemoverUserConfirmDialog } from "./components/remove-user-confirm-dialog";
import { AddUserModal } from "./components/add-user-modal";
import * as lbsUser from "@/services/external-api/user";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Eye, Trash2, UserPlus, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleRemoveClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete?.id) return;

    const userId = userToDelete.id;

    lbsUser
      .deleteUser(userId)
      .then(() => {
        toast.success("Usuário removido com sucesso.");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        toast.error("Erro ao remover usuário.");
      })
      .finally(() => {
        setIsDeleteAlertOpen(false);
        setUserToDelete(null);
      });
  };

  const handlePasswordClick = (user: User) => {
    setCurrentUser(user);
    setIsPasswordDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe o progresso e comunique-se com seus alunos.
          </p>
        </div>
        <Button
          onClick={() => setIsNewUserOpen(true)}
          className="flex w-full items-center justify-center gap-2 md:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Convidar Aluno
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-full pl-10"
              placeholder="Buscar por nome ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cursos</SelectItem>
                <SelectItem value="marketing">Marketing Digital</SelectItem>
                <SelectItem value="leadership">Liderança Avançada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 flow-root">
          <div className="-mx-6 -my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold"
                    >
                      Aluno
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Progresso Geral
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Cursos Inscritos
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6 text-right text-sm font-semibold"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const progress = Math.max(
                        0,
                        Math.min(100, user.progress_percent ?? 0)
                      );
                      return (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt={user.name} />
                                <AvatarFallback>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                  className={`h-2 rounded-full ${
                                    progress >= 70
                                      ? "bg-custom-green"
                                      : progress >= 40
                                      ? "bg-yellow-500"
                                      : "bg-destructive"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span>{progress}%</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-muted-foreground">
                            <div className="flex -space-x-2 overflow-hidden">
                              <span className="inline-block rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Marketing
                              </span>
                              <span className="inline-block rounded-full bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                Liderança
                              </span>
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-5 pl-3 pr-6 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Enviar email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Visualizar"
                                onClick={() => handleEditClick(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Remover"
                                onClick={() => handleRemoveClick(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Nenhum aluno encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Aluno</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja remover{" "}
              <span className="font-semibold">{userToDelete?.name}</span> do
              curso? Esta ação é irreversível e removerá todo o progresso e
              acesso do aluno.
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

      {/* Dialogs */}
      <EditUserModal
        currentUser={currentUser}
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
      />

      <ChangePasswordUserModal
        currentUser={currentUser}
        setIsPasswordDialogOpen={setIsPasswordDialogOpen}
        isPasswordDialogOpen={isPasswordDialogOpen}
      />

      <AddUserModal
        isDialogOpen={isNewUserOpen}
        setIsDialogOpen={setIsNewUserOpen}
      />
    </div>
  );
}
