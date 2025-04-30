import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Integracoes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Integrações</h1>
        <p className="mt-1 text-sm text-gray-500">Documentação da API para integração com o sistema Tripulante</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Overview */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-primary-700 text-white">
              <h3 className="text-lg font-medium leading-6">Visão Geral da API</h3>
            </div>
            <CardContent className="p-0">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Endpoints Disponíveis</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-green-100 text-green-800 text-sm">
                      GET
                    </span>
                    <span className="flex-1 block w-full rounded-r-md border border-gray-300 px-3 py-2 text-gray-700 text-sm">
                      /api/alunos
                    </span>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-100 text-blue-800 text-sm">
                      POST
                    </span>
                    <span className="flex-1 block w-full rounded-r-md border border-gray-300 px-3 py-2 text-gray-700 text-sm">
                      /api/alunos
                    </span>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-amber-100 text-amber-800 text-sm">
                      PUT
                    </span>
                    <span className="flex-1 block w-full rounded-r-md border border-gray-300 px-3 py-2 text-gray-700 text-sm">
                      /api/alunos/:id
                    </span>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-red-100 text-red-800 text-sm">
                      DELETE
                    </span>
                    <span className="flex-1 block w-full rounded-r-md border border-gray-300 px-3 py-2 text-gray-700 text-sm">
                      /api/alunos/:id
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Autenticação</h3>
                <p className="mt-2 text-sm text-gray-500">API utiliza autenticação JWT. Inclua o token no header:</p>
                <div className="mt-2 bg-gray-50 p-2 rounded text-xs font-mono">
                  Authorization: Bearer &lt;seu_token&gt;
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Examples */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-primary-700 text-white">
              <h3 className="text-lg font-medium leading-6">Exemplo de Request</h3>
            </div>
            <CardContent className="p-6">
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="create">Criar Aluno</TabsTrigger>
                  <TabsTrigger value="list">Listar Alunos</TabsTrigger>
                  <TabsTrigger value="update">Atualizar Aluno</TabsTrigger>
                  <TabsTrigger value="delete">Excluir Aluno</TabsTrigger>
                </TabsList>
                
                {/* Create Aluno */}
                <TabsContent value="create" className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">POST /api/alunos - Cadastrar novo aluno</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`POST /api/alunos
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome": "Ana Silva",
  "documento": "123456789",
  "email": "ana.silva@email.com",
  "pais": "Brasil",
  "telefone": "+55 11 91234-5678",
  "whatsapp": "https://wa.me/5511912345678",
  "turma": "Janeiro/2024",
  "data_confirmacao": "2024-01-10",
  "situacao_financeira": "Em dia",
  "periodo_acesso": "12 meses",
  "data_vencimento": "2025-01-10",
  "pagamentos_mensais": {
    "dezembro_2024": true,
    "janeiro_2025": true,
    "fevereiro_2025": false
  },
  "tripulante": true,
  "pronto": true,
  "certificado": true,
  "stcw": false,
  "status_vacina": "Completo",
  "nivel_autoavaliacao": "Intermediário",
  "crew_call": true,
  "data_crew_call": "2024-01-15",
  "entrevistador": "João Pereira",
  "nivel_nivelamento": "Avançado",
  "consideracoes": "Aluna com ótimo desempenho",
  "perfil": "Operacional",
  "comunidade": true,
  "participacao": "Alta",
  "instagram": "@anasilva",
  "close_friends": true,
  "postou_cv": true,
  "analise_cv": "Aprovado",
  "entrevista_marcada": true,
  "empresa": "Cruzeiros Marítimos SA",
  "cargo": "Assistente de Bordo",
  "aprovado": true,
  "data_embarque": "2024-03-10",
  "salario": 3500,
  "contatos": [
    {
      "nome": "Maria Costa",
      "relacao": "Supervisora",
      "telefone": "+55 11 98765-4321"
    }
  ],
  "observacao": "Aluna extremamente dedicada e com experiência prévia em hotelaria."
}`}</code></pre>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-6 mb-4">Resposta de Sucesso</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Aluno cadastrado com sucesso",
  "data": {
    "id": 12345,
    "nome": "Ana Silva",
    "email": "ana.silva@email.com",
    "turma": "Janeiro/2024",
    "created_at": "2024-05-20T14:32:15.000Z"
  }
}`}</code></pre>
                  </div>
                </TabsContent>
                
                {/* List Alunos */}
                <TabsContent value="list" className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">GET /api/alunos - Listar alunos</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`GET /api/alunos?page=1&pageSize=10&search=silva&turma=Janeiro/2024&tripulante=true
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code></pre>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-6 mb-4">Resposta de Sucesso</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": 12345,
      "nome": "Ana Silva",
      "documento": "123456789",
      "email": "ana.silva@email.com",
      "turma": "Janeiro/2024",
      "situacao_financeira": "Em dia",
      "tripulante": true,
      "certificado": true,
      "created_at": "2024-05-20T14:32:15.000Z"
    },
    // mais registros...
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 42,
    "totalPages": 5
  }
}`}</code></pre>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-6 mb-4">Parâmetros de Consulta</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">page</span>: Número da página (padrão: 1)
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">pageSize</span>: Itens por página (padrão: 10)
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">search</span>: Busca por nome, email ou documento
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">turma</span>: Filtro por turma
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">situacao_financeira</span>: Filtro por situação
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">tripulante</span>: Filtro por tripulante (true/false)
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">certificado</span>: Filtro por certificado (true/false)
                    </div>
                  </div>
                </TabsContent>
                
                {/* Update Aluno */}
                <TabsContent value="update" className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">PUT /api/alunos/:id - Atualizar aluno</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`PUT /api/alunos/12345
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome": "Ana Silva Costa",
  "email": "ana.costa@email.com",
  "situacao_financeira": "Pendente",
  "certificado": true
}`}</code></pre>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-6 mb-4">Resposta de Sucesso</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Aluno atualizado com sucesso",
  "data": {
    "id": 12345,
    "nome": "Ana Silva Costa",
    "email": "ana.costa@email.com",
    "situacao_financeira": "Pendente",
    "certificado": true,
    "updated_at": "2024-05-21T10:15:22.000Z"
  }
}`}</code></pre>
                  </div>
                </TabsContent>
                
                {/* Delete Aluno */}
                <TabsContent value="delete" className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">DELETE /api/alunos/:id - Excluir aluno</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`DELETE /api/alunos/12345
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code></pre>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-6 mb-4">Resposta de Sucesso</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 text-white overflow-auto">
                    <pre className="text-xs"><code>{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Aluno excluído com sucesso"
}`}</code></pre>
                  </div>
                </TabsContent>
              </Tabs>

              <h4 className="text-md font-medium text-gray-900 mt-6 mb-2">Campos Obrigatórios</h4>
              <p className="text-sm text-gray-500 mb-4">Os seguintes campos são obrigatórios para cadastro de alunos:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">nome</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">email</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">documento</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">pais</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">telefone</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">turma</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">data_confirmacao</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">situacao_financeira</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">periodo_acesso</span>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-gray-900 mt-6 mb-2">Códigos de Status HTTP</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">200</span>: Sucesso
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">201</span>: Criado com sucesso
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">400</span>: Requisição inválida
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">401</span>: Não autorizado
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">404</span>: Não encontrado
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">500</span>: Erro interno do servidor
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
