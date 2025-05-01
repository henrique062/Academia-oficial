import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const alunos = pgTable("alunos", {
  id_aluno: serial("id_aluno").primaryKey(),
  nome: text("nome"),
  email: text("email"),
  situacao_atual: text("situacao_atual"),
  pais: text("pais"),
});

export const insertAlunoSchema = createInsertSchema(alunos).omit({
  id_aluno: true,
});

export type InsertAluno = z.infer<typeof insertAlunoSchema>;
export type Aluno = typeof alunos.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
