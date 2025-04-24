"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as lbsUser from "@/services/external-api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const passwordFormSchema = z.object({
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  passwordVerify: z.string(),
}).refine((data) => data.password === data.passwordVerify, {
  message: "As senhas não coincidem.",
  path: ["passwordVerify"],
});

type PasswordForm = z.infer<typeof passwordFormSchema>;

interface ChangePasswordUserModalProps {
  isPasswordDialogOpen: boolean;
  setIsPasswordDialogOpen: (isOpen: boolean) => void;
  currentUser: User | null;
}

export function ChangePasswordUserModal({
  isPasswordDialogOpen,
  setIsPasswordDialogOpen,
  currentUser,
}: ChangePasswordUserModalProps) {
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { password: "", passwordVerify: "" },
  });

  useEffect(() => {
    if (currentUser) {
      resetPasswordForm({
        password: "",
        passwordVerify: "",
      });
    }
  }, [currentUser, resetPasswordForm]);

  const onSubmitPassword = (data: PasswordForm) => {
    const user = {
      ...currentUser,
      password: data.password,
      passwordVerify: data.passwordVerify,
    } as User;

    lbsUser.updateUserPassword(user);
    resetPasswordForm({
      password: "",
      passwordVerify: "",
    });
    setIsPasswordDialogOpen(false);
    toast.success("Senha alterada com sucesso!");
  };

  return (
    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar senha</DialogTitle>
          <DialogDescription>
            Defina uma nova senha para o usuário selecionado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Nova senha
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...registerPassword("password")}
                className="col-span-3"
              />

              <span></span>
              {passwordErrors.password && (
                <p className="text-red-500 col-span-3 col-start-2">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passwordVerify" className="text-right">
                Confirmar nova senha
              </Label>
              <Input
                id="passwordVerify"
                type="password"
                autoComplete="new-password"
                {...registerPassword("passwordVerify")}
                className="col-span-3"
              />

              <span></span>
              {passwordErrors.passwordVerify && (
                <p className="text-red-500 col-span-3 col-start-2">
                  {passwordErrors.passwordVerify.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar nova senha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
