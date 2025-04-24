"use client";

import { User } from "@/types/user";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as lbsUser from "@/services/external-api/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

const editUserSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter no mínimo 3 caracteres.",
  }),
  email: z.string().email({
    message: "E-mail inválido.",
  }),
  role: z.string({
    errorMap: () => ({ message: "Selecione um perfil válido." }),
  }),
});

type EditUserForm = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  currentUser: User | null;
}

export function EditUserModal({
  isDialogOpen,
  setIsDialogOpen,
  currentUser,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { name: "", email: "", role: "student" },
  });

  useEffect(() => {
    if (currentUser) {
      resetEditForm({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      });
    }
  }, [currentUser, resetEditForm]);

  const onSubmitEdit = async (data: EditUserForm) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...data,
      };

      await lbsUser.updateUser(updatedUser);
      resetEditForm({
        name: "",
        email: "",
        role: "student",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário atualizado com sucesso!");
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias e clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              <span></span>
              {editErrors.name && (
                <p className="text-red-500 col-span-3 col-start-2">
                  {editErrors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="col-span-3"
              />
              <span></span>
              {editErrors.email && (
                <p className="text-red-500 col-span-3 col-start-2">
                  {editErrors.email.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Perfil
              </Label>
              <select
                id="role"
                {...register("role")}
                className="col-span-3 border rounded px-2 py-1"
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
              </select>
              <span></span>
              {editErrors.role && (
                <p className="text-red-500 col-span-3 col-start-2">
                  {editErrors.role.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
