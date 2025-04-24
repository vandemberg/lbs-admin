"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as lbsUser from "@/services/external-api/user";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Definindo o schema de validação com Zod
const userFormSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
    passwordVerify: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
    role: z.string().min(1, { message: "Perfil é obrigatório" }),
  })
  .refine((data) => data.password === data.passwordVerify, {
    message: "As senhas não coincidem",
    path: ["passwordVerify"],
  });

type UserFormValues = z.infer<typeof userFormSchema>;

interface AddUserModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddUserModal({
  isDialogOpen,
  setIsDialogOpen,
}: AddUserModalProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Configurando o useForm com o resolver do Zod
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordVerify: "",
      role: "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);

    try {
      await lbsUser.registerUser(values);
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Nome</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordVerify"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Perfil</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="student">Estudante</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
