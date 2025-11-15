import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres.")
    .trim(),

  email: z
    .string()
    .email("E-mail inválido.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .max(50, "A senha deve ter no máximo 50 caracteres."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Senha inválida.")
});
