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

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      <div className="my-4 flex flex-row items-center justify-between">
        <p>Que adicionar um novo usuário? </p>

        <Button onClick={() => setIsNewUserOpen(true)} className="mt-2">
          Adicionar Usuário
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Perfil</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <Button
                    onClick={() => handleEditClick(user)}
                    variant="default"
                    size="sm"
                    className="mr-2 cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handlePasswordClick(user)}
                    variant="secondary"
                    size="sm"
                    className="mr-2 cursor-pointer"
                  >
                    Modificar senha
                  </Button>
                  <Button
                    onClick={() => handleRemoveClick(user)}
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog do shadcn para edição */}
      <EditUserModal
        currentUser={currentUser}
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
      />

      {/* Modal de Modificar Senha */}
      <ChangePasswordUserModal
        currentUser={currentUser}
        setIsPasswordDialogOpen={setIsPasswordDialogOpen}
        isPasswordDialogOpen={isPasswordDialogOpen}
      />

      {/* Alert Dialog para confirmação de remoção */}
      <RemoverUserConfirmDialog
        isDeleteAlertOpen={isDeleteAlertOpen}
        confirmDelete={confirmDelete}
        currentUser={userToDelete}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
      />

      {/* Modal para adicionar novo usuário */}
      <AddUserModal
        isDialogOpen={isNewUserOpen}
        setIsDialogOpen={setIsNewUserOpen}
      />
    </div>
  );
}
