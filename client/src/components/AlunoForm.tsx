import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAlunoSchema } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Aluno } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Extend the schema with custom validation
const alunoFormSchema = insertAlunoSchema.extend({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
}).superRefine((data, ctx) => {
  if (!data.tripulante && data.certificado) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Aluno não pode ter certificado se não for tripulante",
      path: ["certificado"],
    });
  }
  
  return true;
});

type AlunoFormValues = z.infer<typeof alunoFormSchema>;

interface AlunoFormProps {
  defaultValues?: Partial<Aluno>;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function AlunoForm({ defaultValues, isEditing = false, onSuccess }: AlunoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // Prepare default values with empty values if none provided
  const formDefaultValues: Partial<AlunoFormValues> = {
    nome: "",
    documento: "",
    email: "",
    pais: "Brasil",
    telefone: "",
    whatsapp: "",
    turma: "",
    data_confirmacao: new Date().toISOString().split("T")[0],
    situacao_financeira: "Em dia",
    periodo_acesso: "12 meses",
    tripulante: false,
    pronto: false,
    certificado: false,
    stcw: false,
    ...defaultValues,
  };

  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: AlunoFormValues) => {
    setIsSubmitting(true);
    try {
      // Format dates from Date objects to ISO strings if needed
      if (data.data_confirmacao && data.data_confirmacao instanceof Date) {
        data.data_confirmacao = data.data_confirmacao.toISOString().split("T")[0];
      }
      
      if (data.data_vencimento && data.data_vencimento instanceof Date) {
        data.data_vencimento = data.data_vencimento.toISOString().split("T")[0];
      }
      
      if (data.data_crew_call && data.data_crew_call instanceof Date) {
        data.data_crew_call = data.data_crew_call.toISOString().split("T")[0];
      }
      
      if (data.data_embarque && data.data_embarque instanceof Date) {
        data.data_embarque = data.data_embarque.toISOString().split("T")[0];
      }
      
      if (isEditing && defaultValues?.id) {
        // Update existing aluno
        await apiRequest("PUT", `/api/alunos/${defaultValues.id}`, data);
        toast({
          title: "Sucesso!",
          description: "Aluno atualizado com sucesso.",
          variant: "default",
        });
      } else {
        // Create new aluno
        await apiRequest("POST", "/api/alunos", data);
        toast({
          title: "Sucesso!",
          description: "Aluno cadastrado com sucesso.",
          variant: "default",
        });
        
        form.reset();
        setActiveTab("dados-pessoais");
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to alunos page if no callback provided
        navigate("/alunos");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao salvar os dados do aluno.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="dados-academicos">Dados Acadêmicos</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="profissional">Profissional</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
              
              {/* Dados Pessoais */}
              <TabsContent value="dados-pessoais" className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documento"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Documento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pais"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>País</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Brasil">Brasil</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Angola">Angola</SelectItem>
                            <SelectItem value="Moçambique">Moçambique</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Link WhatsApp</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://wa.me/5511912345678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="observacao"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Dados Acadêmicos */}
              <TabsContent value="dados-academicos" className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="turma"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Turma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a turma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Janeiro/2024">Janeiro/2024</SelectItem>
                            <SelectItem value="Fevereiro/2024">Fevereiro/2024</SelectItem>
                            <SelectItem value="Março/2024">Março/2024</SelectItem>
                            <SelectItem value="Abril/2024">Abril/2024</SelectItem>
                            <SelectItem value="Maio/2024">Maio/2024</SelectItem>
                            <SelectItem value="Junho/2024">Junho/2024</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="sm:col-span-3">
                    <Separator className="my-4" />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tripulante"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>É Tripulante?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pronto"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Está Pronto?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certificado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Certificado?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stcw"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Tem STCW?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status_vacina"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Status Vacina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Completo">Completo</SelectItem>
                            <SelectItem value="Parcial">Parcial</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Não aplicável">Não aplicável</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nivel_autoavaliacao"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Nível Autoavaliação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                            <SelectItem value="Avançado">Avançado</SelectItem>
                            <SelectItem value="Especialista">Especialista</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="crew_call"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Fez Crew Call?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data_crew_call"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Data Crew Call</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? formatDate(field.value) : "Selecione uma data"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entrevistador"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Nome Entrevistador</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nivel_nivelamento"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Nível Nivelamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                            <SelectItem value="Avançado">Avançado</SelectItem>
                            <SelectItem value="Especialista">Especialista</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="consideracoes"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Considerações</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Financeiro */}
              <TabsContent value="financeiro" className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="data_confirmacao"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Data de Confirmação da Compra</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? formatDate(field.value) : "Selecione uma data"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="situacao_financeira"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Situação Financeira</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a situação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Em dia">Em dia</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Atrasado">Atrasado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="periodo_acesso"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Período de Acesso</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="6 meses">6 meses</SelectItem>
                            <SelectItem value="12 meses">12 meses</SelectItem>
                            <SelectItem value="18 meses">18 meses</SelectItem>
                            <SelectItem value="24 meses">24 meses</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data_vencimento"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Data de Vencimento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? formatDate(field.value) : "Selecione uma data"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="alerta_vencimento"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Alerta Vencimento (30 dias antes)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? formatDate(field.value) : "Selecione uma data"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem className="sm:col-span-6">
                    <FormLabel className="block text-sm font-medium mb-2">Pagamentos mensais</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "Dezembro/2024", "Janeiro/2025", "Fevereiro/2025", 
                        "Março/2025", "Abril/2025", "Maio/2025",
                        "Junho/2025", "Julho/2025", "Agosto/2025",
                        "Setembro/2025", "Outubro/2025", "Novembro/2025",
                        "Dezembro/2025"
                      ].map((mes) => (
                        <FormField
                          key={mes}
                          control={form.control}
                          name={`pagamentos_mensais.${mes.toLowerCase()}`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label>{mes}</Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                </div>
              </TabsContent>
              
              {/* Profissional */}
              <TabsContent value="profissional" className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="perfil"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Perfil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Operacional">Operacional</SelectItem>
                            <SelectItem value="Técnico">Técnico</SelectItem>
                            <SelectItem value="Gerencial">Gerencial</SelectItem>
                            <SelectItem value="Executivo">Executivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postou_cv"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Postou CV</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="analise_cv"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Análise CV</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Em análise">Em análise</SelectItem>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Reprovado">Reprovado</SelectItem>
                            <SelectItem value="Requer ajustes">Requer ajustes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entrevista_marcada"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Entrevista Marcada?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="empresa"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aprovado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Aprovado?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data_embarque"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Data Embarque</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? formatDate(field.value) : "Selecione uma data"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salario"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Salário</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="coleta_prova"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Coleta de Prova</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo_prova"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Tipo de Prova</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Teórica">Teórica</SelectItem>
                            <SelectItem value="Prática">Prática</SelectItem>
                            <SelectItem value="Mista">Mista</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="link_arquivo"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Link do Arquivo</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="motivos"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Motivos</FormLabel>
                        <FormControl>
                          <Textarea rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quem"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Quem</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Social */}
              <TabsContent value="social" className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="comunidade"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Está na Comunidade?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="participacao"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Participação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Muito Alta">Muito Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="@username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="close_friends"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-3">
                        <div className="space-y-0.5">
                          <FormLabel>Close Friends?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comentarios"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Comentários</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/alunos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              isEditing ? "Atualizar" : "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
