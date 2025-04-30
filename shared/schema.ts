import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const alunos = pgTable("alunos", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  documento: text("documento").notNull(),
  email: text("email").notNull(),
  pais: text("pais").notNull(),
  telefone: text("telefone").notNull(),
  whatsapp: text("whatsapp"),
  turma: text("turma").notNull(),
  data_confirmacao: date("data_confirmacao").notNull(),
  alerta_vencimento: date("alerta_vencimento"),
  periodo_acesso: text("periodo_acesso").notNull(),
  situacao_financeira: text("situacao_financeira").notNull(),
  observacao: text("observacao"),
  data_vencimento: date("data_vencimento"),
  pagamentos_mensais: jsonb("pagamentos_mensais"),
  
  // Dados acadêmicos
  tripulante: boolean("tripulante").default(false),
  pronto: boolean("pronto").default(false),
  certificado: boolean("certificado").default(false),
  stcw: boolean("stcw").default(false),
  status_vacina: text("status_vacina"),
  nivel_autoavaliacao: text("nivel_autoavaliacao"),
  crew_call: boolean("crew_call").default(false),
  data_crew_call: date("data_crew_call"),
  entrevistador: text("entrevistador"),
  nivel_nivelamento: text("nivel_nivelamento"),
  consideracoes: text("consideracoes"),
  
  // Dados profissionais
  perfil: text("perfil"),
  comunidade: boolean("comunidade").default(false),
  participacao: text("participacao"),
  instagram: text("instagram"),
  close_friends: boolean("close_friends").default(false),
  postou_cv: boolean("postou_cv").default(false),
  analise_cv: text("analise_cv"),
  datas_responsaveis: jsonb("datas_responsaveis"),
  comentarios: text("comentarios"),
  entrevista_marcada: boolean("entrevista_marcada").default(false),
  empresa: text("empresa"),
  cargo: text("cargo"),
  aprovado: boolean("aprovado").default(false),
  data_embarque: date("data_embarque"),
  salario: integer("salario"),
  
  // Prova
  coleta_prova: text("coleta_prova"),
  tipo_prova: text("tipo_prova"),
  link_arquivo: text("link_arquivo"),
  
  // Outros
  contatos: jsonb("contatos"),
  motivos: text("motivos"),
  quem: text("quem"),
  
  // Metadados
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertAlunoSchema = createInsertSchema(alunos).omit({
  id: true,
  created_at: true,
  updated_at: true
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
