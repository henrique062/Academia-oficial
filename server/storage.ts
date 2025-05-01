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
    try {
      // Using Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "users" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return undefined;
        }
        
        // Não logar erro para item não encontrado
        if (error.code !== 'PGRST116') { // PGRST116 é "No rows returned"  
          console.error('Error fetching user:', error);
        }
        return undefined;
      }
      
      return data as User || undefined;
    } catch (err) {
      console.error('Exceção ao buscar usuário:', err);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Using Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
        
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "users" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return undefined;
        }
        
        // Não logar erro para item não encontrado
        if (error.code !== 'PGRST116') { // PGRST116 é "No rows returned"
          console.error('Error fetching user by username:', error);
        }
        return undefined;
      }
      
      return data as User || undefined;
    } catch (err) {
      console.error('Exceção ao buscar usuário por nome de usuário:', err);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Using Supabase
      const { data, error } = await supabase
        .from('users')
        .insert(insertUser)
        .select()
        .single();
      
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "users" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          throw new Error('A tabela de usuários não existe. Por favor, siga as instruções em SETUP-SUPABASE.md para criar as tabelas.');
        }
        
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
      }
      
      return data as User;
    } catch (err) {
      // Se já for uma instância de Error, repassar o erro
      if (err instanceof Error) {
        throw err;
      }
      
      console.error('Exceção ao criar usuário:', err);
      throw new Error('Ocorreu um erro ao criar o usuário.');
    }
  }
  
  // Alunos operations
  async getAlunos(page = 1, pageSize = 10, search = '', filters: Record<string, any> = {}): Promise<{ data: Aluno[], total: number }> {
    const offset = (page - 1) * pageSize;
    
    try {
      // Start Supabase query
      let query = supabase
        .from('alunos')
        .select('*', { count: 'exact' });
      
      // Apply search if provided
      if (search) {
        query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      // Log filters for debugging
      console.log('Filtros aplicados:', filters);
      
      // Apply filters if provided
      if (filters) {
        if (filters.situacao_atual) {
          console.log('Aplicando filtro situacao_atual:', filters.situacao_atual);
          query = query.eq('situacao_atual', filters.situacao_atual);
        }
        
        if (filters.pais) {
          console.log('Aplicando filtro pais:', filters.pais);
          query = query.eq('pais', filters.pais);
        }
      }
      
      // Add pagination (without ordering by created_at since it's not in the schema anymore)
      const { data, error, count } = await query
        .range(offset, offset + pageSize - 1);
      
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "alunos" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return { data: [], total: 0 };
        }
        console.error('Error fetching alunos:', error);
        return { data: [], total: 0 };
      }
      
      return { 
        data: data as Aluno[],
        total: count || 0
      };
    } catch (err) {
      console.error('Exceção ao buscar alunos:', err);
      return { data: [], total: 0 };
    }
  }
  
  async getAluno(id: number): Promise<Aluno | undefined> {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('id_aluno', id)
        .single();
        
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "alunos" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return undefined;
        }
        
        // Não logar erro para item não encontrado
        if (error.code !== 'PGRST116') { // PGRST116 é "No rows returned"
          console.error('Error fetching aluno:', error);
        }
        return undefined;
      }
      
      return data as Aluno || undefined;
    } catch (err) {
      console.error('Exceção ao buscar aluno:', err);
      return undefined;
    }
  }
  
  async createAluno(insertAluno: InsertAluno): Promise<Aluno> {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .insert(insertAluno)
        .select()
        .single();
      
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "alunos" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          throw new Error('A tabela de alunos não existe. Por favor, siga as instruções em SETUP-SUPABASE.md para criar as tabelas.');
        }
        
        console.error('Error creating aluno:', error);
        throw new Error(`Failed to create aluno: ${error.message}`);
      }
      
      return data as Aluno;
    } catch (err) {
      // Se já for uma instância de Error, repassar o erro
      if (err instanceof Error) {
        throw err;
      }
      
      console.error('Exceção ao criar aluno:', err);
      throw new Error('Ocorreu um erro ao criar o aluno.');
    }
  }
  
  async updateAluno(id: number, updateData: Partial<InsertAluno>): Promise<Aluno | undefined> {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .update(updateData)
        .eq('id_aluno', id)
        .select()
        .single();
      
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "alunos" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return undefined;
        }
        
        console.error('Error updating aluno:', error);
        return undefined;
      }
      
      return data as Aluno;
    } catch (err) {
      console.error('Exceção ao atualizar aluno:', err);
      return undefined;
    }
  }
  
  async deleteAluno(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alunos')
        .delete()
        .eq('id_aluno', id);
      
      if (error) {
        // Verifica se o erro é "relation does not exist" - código 42P01
        if (error.code === '42P01') {
          console.error('A tabela "alunos" não existe. Por favor, crie a tabela conforme as instruções em SETUP-SUPABASE.md');
          return false;
        }
        
        console.error('Error deleting aluno:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exceção ao deletar aluno:', err);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
