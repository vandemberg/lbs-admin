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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Schema de validação simplificado - apenas e-mail
const inviteUserSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

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

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: InviteUserFormValues) => {
    setIsLoading(true);

    try {
      await lbsUser.inviteUser(values.email);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Convite enviado com sucesso!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error: unknown) {
      console.error("Erro ao enviar convite:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message
        : undefined;
      toast.error(errorMessage || "Erro ao enviar convite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convidar Aluno</DialogTitle>
          <DialogDescription>
            Digite o e-mail do aluno que deseja convidar. Um e-mail de convite
            será enviado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="aluno@exemplo.com"
                      className="col-span-3"
                    />
                  </FormControl>
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
                {isLoading ? "Enviando..." : "Enviar Convite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
