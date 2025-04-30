import { alunos, type Aluno, type InsertAluno, users, type User, type InsertUser } from "@shared/schema";
import { db, supabase } from "./db";
import { eq, like, desc, and, or, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

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
    // Using Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return data as User || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Using Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    return data as User || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Using Supabase
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    return data as User;
  }
  
  // Alunos operations
  async getAlunos(page = a1, pageSize = 10, search = '', filters: Record<string, any> = {}): Promise<{ data: Aluno[], total: number }> {
    const offset = (page - 1) * pageSize;
    
    // Start Supabase query
    let query = supabase
      .from('alunos')
      .select('*', { count: 'exact' });
    
    // Apply search if provided
    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,documento.ilike.%${search}%`);
    }
    
    // Apply filters if provided
    if (filters) {
      if (filters.turma) {
        query = query.eq('turma', filters.turma);
      }
      
      if (filters.situacao_financeira) {
        query = query.eq('situacao_financeira', filters.situacao_financeira);
      }
      
      if (filters.tripulante !== undefined) {
        query = query.eq('tripulante', filters.tripulante === 'true');
      }
      
      if (filters.certificado !== undefined) {
        query = query.eq('certificado', filters.certificado === 'true');
      }
    }
    
    // Add pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    
    if (error) {
      console.error('Error fetching alunos:', error);
      return { data: [], total: 0 };
    }
    
    return { 
      data: data as Aluno[],
      total: count || 0
    };
  }
  
  async getAluno(id: number): Promise<Aluno | undefined> {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching aluno:', error);
      return undefined;
    }
    
    return data as Aluno || undefined;
  }
  
  async createAluno(insertAluno: InsertAluno): Promise<Aluno> {
    const { data, error } = await supabase
      .from('alunos')
      .insert(insertAluno)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating aluno:', error);
      throw new Error(`Failed to create aluno: ${error.message}`);
    }
    
    return data as Aluno;
  }
  
  async updateAluno(id: number, updateData: Partial<InsertAluno>): Promise<Aluno | undefined> {
    const { data, error } = await supabase
      .from('alunos')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating aluno:', error);
      return undefined;
    }
    
    return data as Aluno;
  }
  
  async deleteAluno(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('alunos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting aluno:', error);
      return false;
    }
    
    return true;
  }
}

export const storage = new DatabaseStorage();
