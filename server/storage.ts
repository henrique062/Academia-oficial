import { alunos, type Aluno, type InsertAluno, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Aluno operations
  getAlunos(page?: number, pageSize?: number, search?: string, filters?: Record<string, any>): Promise<{ data: Aluno[], total: number }>;
  getAluno(id: number): Promise<Aluno | undefined>;
  createAluno(aluno: InsertAluno): Promise<Aluno>;
  updateAluno(id: number, aluno: Partial<InsertAluno>): Promise<Aluno | undefined>;
  deleteAluno(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Alunos operations
  async getAlunos(page = 1, pageSize = 10, search = '', filters: Record<string, any> = {}): Promise<{ data: Aluno[], total: number }> {
    const offset = (page - 1) * pageSize;
    
    let query = db.select().from(alunos);
    
    // Apply search if provided
    if (search) {
      query = query.where(
        or(
          like(alunos.nome, `%${search}%`),
          like(alunos.email, `%${search}%`),
          like(alunos.documento, `%${search}%`)
        )
      );
    }
    
    // Apply filters if provided
    if (filters) {
      const conditions = [];
      
      if (filters.turma) {
        conditions.push(eq(alunos.turma, filters.turma));
      }
      
      if (filters.situacao_financeira) {
        conditions.push(eq(alunos.situacao_financeira, filters.situacao_financeira));
      }
      
      if (filters.tripulante !== undefined) {
        conditions.push(eq(alunos.tripulante, filters.tripulante === 'true'));
      }
      
      if (filters.certificado !== undefined) {
        conditions.push(eq(alunos.certificado, filters.certificado === 'true'));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    // Get total count for pagination
    const countResult = await db.select({ count: alunos.id }).from(alunos);
    const total = countResult.length;
    
    // Get data with pagination
    const data = await query
      .orderBy(desc(alunos.created_at))
      .limit(pageSize)
      .offset(offset);
    
    return { data, total };
  }
  
  async getAluno(id: number): Promise<Aluno | undefined> {
    const [aluno] = await db.select().from(alunos).where(eq(alunos.id, id));
    return aluno || undefined;
  }
  
  async createAluno(insertAluno: InsertAluno): Promise<Aluno> {
    const [aluno] = await db
      .insert(alunos)
      .values(insertAluno)
      .returning();
    return aluno;
  }
  
  async updateAluno(id: number, updateData: Partial<InsertAluno>): Promise<Aluno | undefined> {
    const [updated] = await db
      .update(alunos)
      .set({
        ...updateData,
        updated_at: new Date()
      })
      .where(eq(alunos.id, id))
      .returning();
    
    return updated;
  }
  
  async deleteAluno(id: number): Promise<boolean> {
    const result = await db
      .delete(alunos)
      .where(eq(alunos.id, id))
      .returning({ id: alunos.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
