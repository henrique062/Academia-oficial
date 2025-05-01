import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAlunoSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { WebSocketServer } from "ws";
import { db, supabase } from "./db";
import { eq } from "drizzle-orm";
import { alunos } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  
  // Health check endpoint for Docker/EasyPanel
  app.get("/api/health", async (req, res) => {
    try {
      // Verificar conexão com o banco de dados
      const dbStatus = await db.execute('SELECT 1 as db_check')
        .then(() => "connected")
        .catch((err) => `error: ${err.message}`);
      
      // Informações do sistema
      const systemInfo = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        database: dbStatus,
        uptime: Math.floor(process.uptime()), // segundos
        memory: {
          rss: Math.round(process.memoryUsage().rss / (1024 * 1024)), // MB
          heapTotal: Math.round(process.memoryUsage().heapTotal / (1024 * 1024)), // MB
          heapUsed: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)), // MB
        }
      };
      
      // Verificar se deve retornar todas as informações ou apenas o status básico
      const isDetailedCheck = req.query.detailed === 'true';
      
      if (isDetailedCheck) {
        res.status(200).json(systemInfo);
      } else {
        // Resposta simplificada
        res.status(200).json({
          status: dbStatus === "connected" ? "ok" : "error",
          timestamp: systemInfo.timestamp
        });
      }
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ 
        status: "error", 
        timestamp: new Date().toISOString(),
        message: "Failed to perform health check"
      });
    }
  });

  // API routes prefix
  const apiRouter = express.Router();
  
  // Get all alunos with pagination, search and filters
  apiRouter.get('/alunos', async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.search as string) || '';
      
      // Extract filters from query params
      const filters: Record<string, any> = {};
      const allowedFilters = ['turma', 'situacao_financeira', 'tripulante', 'certificado', 'situacao_atual', 'pais'];
      
      allowedFilters.forEach(filter => {
        if (req.query[filter] !== undefined) {
          filters[filter] = req.query[filter];
        }
      });
      
      const result = await storage.getAlunos(page, pageSize, search, filters);
      
      res.json({
        data: result.data,
        pagination: {
          page,
          pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / pageSize)
        }
      });
    } catch (error) {
      console.error('Error retrieving alunos:', error);
      res.status(500).json({ message: 'Erro ao buscar alunos' });
    }
  });
  
  // Get a single aluno by ID
  apiRouter.get('/alunos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      
      const aluno = await storage.getAluno(id);
      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
      
      res.json(aluno);
    } catch (error) {
      console.error('Error retrieving aluno:', error);
      res.status(500).json({ message: 'Erro ao buscar aluno' });
    }
  });
  
  // Create a new aluno
  apiRouter.post('/alunos', async (req: Request, res: Response) => {
    try {
      const alunoData = insertAlunoSchema.parse(req.body);
      const aluno = await storage.createAluno(alunoData);
      
      res.status(201).json({
        success: true,
        message: 'Aluno cadastrado com sucesso',
        data: aluno
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Erro de validação', 
          errors: validationError.message 
        });
      }
      
      console.error('Error creating aluno:', error);
      res.status(500).json({ message: 'Erro ao cadastrar aluno' });
    }
  });
  
  // Update an existing aluno
  apiRouter.put('/alunos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      
      // Get existing aluno to check if it exists
      const existingAluno = await storage.getAluno(id);
      if (!existingAluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
      
      // Validate the update data
      const updateData = req.body;
      
      // Update the aluno
      const updatedAluno = await storage.updateAluno(id, updateData);
      
      res.json({
        success: true,
        message: 'Aluno atualizado com sucesso',
        data: updatedAluno
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Erro de validação', 
          errors: validationError.message 
        });
      }
      
      console.error('Error updating aluno:', error);
      res.status(500).json({ message: 'Erro ao atualizar aluno' });
    }
  });
  
  // Delete an aluno
  apiRouter.delete('/alunos/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      
      const result = await storage.deleteAluno(id);
      if (!result) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
      
      res.json({
        success: true,
        message: 'Aluno excluído com sucesso'
      });
    } catch (error) {
      console.error('Error deleting aluno:', error);
      res.status(500).json({ message: 'Erro ao excluir aluno' });
    }
  });
  
  // Register API routes
  app.use('/api', apiRouter);

  return server;
}
