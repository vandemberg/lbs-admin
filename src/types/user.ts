import { z } from "zod";

export interface User {
  id?: number | null | undefined;
  name: string;
  email: string;
  role: string;
  password?: string;
  passwordVerify?: string;
  created_at?: string | null | undefined;
  updated_at?: string | null | undefined;
}

export const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.string().min(1, "Função é obrigatória"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  id: z.number().optional().nullable().nullable(),
});

export type UserForm = z.infer<typeof userFormSchema>;
