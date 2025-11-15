import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório."),
  description: z.string().optional(),
  dueDate: z.string().refine(
    (value) => !isNaN(Date.parse(value)),
    "Data inválida."
  ),
  status: z.enum(["PENDENTE", "CONCLUIDA"]).default("PENDENTE"),
  subject: z.string().optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Título não pode estar vazio.").optional(),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Data inválida.")
    .optional(),
  status: z.enum(["PENDENTE", "CONCLUIDA"]).optional(),
  subject: z.string().optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA"]).optional(),
});
