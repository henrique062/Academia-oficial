import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { formatBoolean, getSituacaoFinanceiraColor } from "@/lib/utils";
import { Edit, Trash2, UserPlus, Users, CheckCircle, Clock, Award } from "lucide-react";
import { useState } from "react";
import { Aluno } from "@shared/schema";
import DeleteAlunoDialog from "@/components/DeleteAlunoDialog";
import { queryClient } from "@/lib/queryClient";

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
      const confirmados = result.data.filter((aluno: Aluno) => aluno.situacao_financeira === 'Em dia').length;
      const pendentes = result.data.filter((aluno: Aluno) => aluno.situacao_financeira === 'Pendente').length;
      const certificados = result.data.filter((aluno: Aluno) => aluno.certificado === true).length;
      
      return { total, confirmados, pendentes, certificados };
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
        <StatusBadge color={getSituacaoFinanceiraColor(row.original.situacao_financeira)}>
          {row.original.situacao_financeira}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "tripulante",
      header: "Tripulante",
      cell: ({ row }: any) => (
        <StatusBadge color={row.original.tripulante ? "green" : "gray"}>
          {formatBoolean(row.original.tripulante)}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "certificado",
      header: "Certificado",
      cell: ({ row }: any) => (
        <StatusBadge color={row.original.certificado ? "green" : "gray"}>
          {formatBoolean(row.original.certificado)}
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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard do Curso Tripulante</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie todos os alunos e informações do programa de formação</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Alunos */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Alunos</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats?.total || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-primary-600 hover:text-primary-500">
                Ver todos
              </Link>
            </div>
          </div>
        </Card>

        {/* Confirmados */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Alunos Confirmados</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats?.confirmados || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-primary-600 hover:text-primary-500">
                Ver detalhes
              </Link>
            </div>
          </div>
        </Card>

        {/* Pendentes */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Alunos Pendentes</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats?.pendentes || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-primary-600 hover:text-primary-500">
                Ver pendentes
              </Link>
            </div>
          </div>
        </Card>

        {/* Certificados */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Certificados Emitidos</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats?.certificados || '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
            <div className="text-sm">
              <Link href="/alunos" className="font-medium text-primary-600 hover:text-primary-500">
                Ver certificados
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Table section */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center mb-4">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Alunos Recentes</h2>
            <p className="mt-2 text-sm text-gray-700">Lista dos últimos alunos cadastrados no sistema.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href="/cadastro">
              <Button>
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
          alunoId={selectedAluno.id}
          alunoNome={selectedAluno.nome}
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
