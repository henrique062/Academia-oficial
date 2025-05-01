import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Tabela de alunos - Base de dados principal do sistema
 */
export const alunos = pgTable("alunos", {
  // Dados de identificação
  id_aluno: serial("id_aluno").primaryKey(),
  nome: text("nome"),
  email: text("email"),
  telefone: text("telefone"),
  
  // Dados de status
  situacao_atual: text("situacao_atual"), // 'ACTIVE', 'BLOCKED', etc
  situacao_financeira: text("situacao_financeira"), // 'OK', 'Pendente', 'Atrasado'
  tripulante: boolean("tripulante").default(false),
  
  // Dados de localização
  pais: text("pais"),
  cidade: text("cidade"),
  estado: text("estado"),
  
  // Dados de curso
  turma: text("turma"),
  data_inscricao: timestamp("data_inscricao").defaultNow(),
  data_conclusao: timestamp("data_conclusao"),
  
  // Certificação
  certificado: boolean("certificado").default(false),
  
  // Metadados adicionais
  observacoes: text("observacoes"),
  metadata: jsonb("metadata"),
  
  // Auditoria
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/**
 * Schema de inserção - valida dados ao inserir um novo aluno
 */
export const insertAlunoSchema = createInsertSchema(alunos).omit({
  id_aluno: true,
  created_at: true,
  updated_at: true,
});

export type InsertAluno = z.infer<typeof insertAlunoSchema>;
export type Aluno = typeof alunos.$inferSelect;

/**
 * Tabela de usuários - Autenticação e acesso ao sistema
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  nome_completo: text("nome_completo"),
  role: text("role").default("user"),
  ativo: boolean("ativo").default(true),
  ultimo_login: timestamp("ultimo_login"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/**
 * Schema de inserção - valida dados ao inserir um novo usuário
 */
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  nome_completo: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
