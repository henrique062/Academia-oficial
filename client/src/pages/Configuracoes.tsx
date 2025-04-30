import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Anchor, Bell, User, Lock, Database, HelpCircle, Shield, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      });
    }, 800);
  };
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie as configurações da aplicação Tripulante</p>
      </div>
      
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        {/* Geral */}
        <TabsContent value="geral">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-primary-600" />
                  Informações da Escola
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas da instituição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-escola">Nome da Escola</Label>
                    <Input id="nome-escola" defaultValue="Tripulante Curso" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <Input id="site" defaultValue="https://tripulante.edu.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Email de Contato</Label>
                    <Input id="contato" defaultValue="contato@tripulante.edu.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" defaultValue="+55 (11) 91234-5678" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary-600" />
                  Preferências
                </CardTitle>
                <CardDescription>
                  Configure as preferências gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="theme" className="flex flex-col space-y-1">
                      <span>Idioma padrão</span>
                    </Label>
                    <Select defaultValue="pt-br">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en-us">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="tema" className="flex flex-col space-y-1">
                      <span>Tema</span>
                    </Label>
                    <Select defaultValue="dark">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Modo manutenção</Label>
                      <p className="text-sm text-muted-foreground">
                        Coloque o site em modo de manutenção
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Exibir rodapé</Label>
                      <p className="text-sm text-muted-foreground">
                        Mostrar rodapé com informações e links
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary-600" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>
                Configure como e quando você receberá notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Alertas por email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Novo aluno cadastrado</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando um novo aluno for cadastrado
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Pagamento pendente</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerta quando um aluno estiver com pagamento pendente
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Alerta de vencimento</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificação 30 dias antes de um aluno ter seu acesso expirado
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Resumo semanal</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba um resumo semanal das atividades do sistema
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Alertas do sistema</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notificações no navegador</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações push no navegador
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Som de notificação</Label>
                        <p className="text-sm text-muted-foreground">
                          Tocar som quando uma notificação for recebida
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Usuários */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                Gestão de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie os usuários que têm acesso ao painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Função</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Admin
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          admin@tripulante.edu.br
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          Administrador
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Ativo
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900 mr-4">
                            Editar
                          </a>
                          <a href="#" className="text-red-600 hover:text-red-900">
                            Remover
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Coordenador
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          coordenador@tripulante.edu.br
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          Coordenador
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Ativo
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900 mr-4">
                            Editar
                          </a>
                          <a href="#" className="text-red-600 hover:text-red-900">
                            Remover
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Políticas de segurança</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Autenticação de dois fatores</Label>
                        <p className="text-sm text-muted-foreground">
                          Requer verificação adicional para todos os usuários
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Bloqueio após tentativas</Label>
                        <p className="text-sm text-muted-foreground">
                          Bloquear conta após 5 tentativas falhas de login
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senha-expira">Expiração de senha (dias)</Label>
                      <Input id="senha-expira" type="number" defaultValue="90" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integração */}
        <TabsContent value="integracao">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary-600" />
                Configurações de API
              </CardTitle>
              <CardDescription>
                Gerencie as configurações de API e integrações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Chaves de API</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Chave de API</Label>
                      <div className="flex gap-2">
                        <Input id="api-key" value="••••••••••••••••••••••••••••••" disabled />
                        <Button variant="outline">Mostrar</Button>
                        <Button variant="outline">Regenerar</Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Criada em: 15/04/2024 - Nunca expira
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Registrar uso da API</Label>
                        <p className="text-sm text-muted-foreground">
                          Registrar todas as chamadas de API no log
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Limite de requisições</Label>
                        <p className="text-sm text-muted-foreground">
                          Limitar a 1000 requisições por minuto
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Webhooks</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">URL do Webhook</Label>
                      <Input id="webhook-url" placeholder="https://seusite.com/webhook" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Eventos para disparar webhook</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="aluno-criado" />
                          <label
                            htmlFor="aluno-criado"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Aluno criado
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="aluno-atualizado" />
                          <label
                            htmlFor="aluno-atualizado"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Aluno atualizado
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="aluno-removido" />
                          <label
                            htmlFor="aluno-removido"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Aluno removido
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pagamento-confirmado" />
                          <label
                            htmlFor="pagamento-confirmado"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Pagamento confirmado
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" className="mr-2">Testar Webhook</Button>
                      <Button>Salvar Webhook</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sistema */}
        <TabsContent value="sistema">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary-600" />
                  Informações do Sistema
                </CardTitle>
                <CardDescription>
                  Informações técnicas sobre a instalação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Versão</h4>
                      <p className="mt-1">1.0.0</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Ambiente</h4>
                      <p className="mt-1">Produção</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Node.js</h4>
                      <p className="mt-1">v18.16.0</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Database</h4>
                      <p className="mt-1">PostgreSQL 14</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Último backup</h4>
                      <p className="mt-1">21/05/2024 03:00</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Uptime</h4>
                      <p className="mt-1">15 dias, 7 horas</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Ações do sistema</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Limpar Cache
                      </Button>
                      <Button variant="outline" size="sm">
                        Backup Manual
                      </Button>
                      <Button variant="outline" size="sm">
                        Verificar Atualizações
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary-600" />
                  Logs e Diagnósticos
                </CardTitle>
                <CardDescription>
                  Acesse logs e ferramentas de diagnóstico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="log-level">Nível de log</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Apenas erros</SelectItem>
                        <SelectItem value="warn">Avisos e erros</SelectItem>
                        <SelectItem value="info">Informações</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Arquivos de log recentes</Label>
                      <Button variant="link" className="p-0 h-auto">Baixar todos</Button>
                    </div>
                    <div className="rounded-md border divide-y">
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm">application.log</span>
                        <Button variant="ghost" size="sm">Baixar</Button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm">error.log</span>
                        <Button variant="ghost" size="sm">Baixar</Button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm">access.log</span>
                        <Button variant="ghost" size="sm">Baixar</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Diagnóstico</Label>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Verificar Segurança
                      </Button>
                      <Button variant="outline">
                        <Database className="mr-2 h-4 w-4" />
                        Testar Conexão DB
                      </Button>
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Testar Envio de Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
