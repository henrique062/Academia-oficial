import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { DataTable } from "../components/ui/data-table";
import { Button } from "../components/ui/button";
import StatusBadge from "../components/StatusBadge";
import { formatBoolean, getSituacaoFinanceiraColor } from "../lib/utils";
import { Edit, Trash2, UserPlus, Users, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Aluno } from "../../../shared/schema";
import DeleteAlunoDialog from "../components/DeleteAlunoDialog";
import { queryClient } from "../lib/queryClient";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  
  // Fetch alunos data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/alunos', page, pageSize],
    queryFn: async () => {
      const response = await fetch(`/api/alunos?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alunos');
      }
      return response.json();
    }
  });
  
  // Fetch stats for dashboard cards
  const { data: stats } = useQuery({
    queryKey: ['/api/alunos?pageSize=1000'],
    queryFn: async () => {
      const response = await fetch('/api/alunos?pageSize=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const result = await response.json();
      
      // Calculate stats
      const total = result.data.length;
      
      // Evitar erros de tipagem, verificando a existência da propriedade antes de filtrar
      const confirmados = result.data.filter((aluno: any) => 
        aluno.tripulante === true || 
        (aluno.status === 'Confirmado') || 
        (aluno.status === 'ACTIVE')
      ).length;
      
      const pendentes = result.data.filter((aluno: any) => 
        aluno.situacao_financeira === 'Pendente' || 
        aluno.status === 'Pendente' || 
        aluno.situacao_atual === 'Pendente'
      ).length;
      
      return { total, confirmados, pendentes };
    }
  });
  
  const handleDeleteClick = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteSuccess = () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['/api/alunos'] });
  };
  
  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }: any) => <span className="font-medium">{row.original.nome}</span>,
    },
    {
      accessorKey: "turma",
      header: "Turma",
    },
    {
      accessorKey: "situacao_financeira",
      header: "Situação",
      cell: ({ row }: any) => (
        <StatusBadge color={row.original.tripulante ? "green" : "red"}>
          {row.original.tripulante ? "Ativo" : "Inativo"}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "tripulante",
      header: "Tripulante",
      cell: ({ row }: any) => (
        <StatusBadge color={row.original.tripulante ? "green" : "red"}>
          {row.original.tripulante ? "Ativo" : "Inativo"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex justify-end gap-2">
          <Link href={`/alunos/${row.original.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4 text-primary-600" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteClick(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Curso Tripulante</h1>
        <p className="mt-1 text-sm text-gray-600">Gerencie todos os alunos e informações do programa de formação</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Total Alunos */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-5 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-primary-50 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">Total de Alunos</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.total || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-white px-5 py-3 border-t border-primary-100">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-sky-400 hover:text-sky-500 transition-colors duration-150">
                Ver todos
              </Link>
            </div>
          </div>
        </Card>

        {/* Alunos Ativos */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-5 bg-gradient-to-br from-white to-green-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">Alunos Ativos</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.confirmados || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-green-50 px-5 py-3 border-t border-green-100">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-150">
                Ver detalhes
              </Link>
            </div>
          </div>
        </Card>

        {/* Pendentes */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-5 bg-gradient-to-br from-white to-amber-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-amber-50 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">Pagamento Pendente</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.pendentes || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-amber-50 px-5 py-3 border-t border-amber-100">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-amber-600 hover:text-amber-500 transition-colors duration-150">
                Ver pendentes
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Table section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-bold text-gray-900">Alunos Recentes</h2>
            <p className="mt-2 text-sm text-gray-600">Lista dos últimos alunos cadastrados no sistema.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href="/cadastro">
              <Button className="bg-primary-400 hover:bg-primary-500 shadow-sm transition-colors duration-150">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Aluno
              </Button>
            </Link>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={data?.data || []}
          pageCount={data?.pagination?.totalPages}
          onPaginationChange={(page, pageSize) => setPage(page)}
          currentPage={page}
          pageSize={pageSize}
          totalItems={data?.pagination?.total}
        />
      </div>
      
      {/* Delete dialog */}
      {selectedAluno && (
        <DeleteAlunoDialog
          alunoId={selectedAluno.id_aluno}
          alunoNome={selectedAluno.nome || "Aluno"}
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
