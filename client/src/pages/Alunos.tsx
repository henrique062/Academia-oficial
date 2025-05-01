import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { formatBoolean, getSituacaoFinanceiraColor } from "@/lib/utils";
import { Edit, Trash2, UserPlus, Search } from "lucide-react";
import DeleteAlunoDialog from "@/components/DeleteAlunoDialog";
import { Aluno } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";

export default function Alunos() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    situacao_atual: "todas",
    pais: "todos"
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  
  // Create a ref for the search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
    // Clear any previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1); // Reset to first page on new search
    }, 500);
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on new filters
  };
  
  // Fetch filtered alunos data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/alunos', page, pageSize, debouncedSearch, filters],
    queryFn: async () => {
      // Build query string
      let queryParams = `page=${page}&pageSize=${pageSize}`;
      
      if (debouncedSearch) {
        queryParams += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'todas' && value !== 'todos') {
          queryParams += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const response = await fetch(`/api/alunos?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alunos');
      }
      return response.json();
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
      accessorKey: "id_aluno",
      header: "ID",
      cell: ({ row }: any) => <span className="font-medium">{row.original.id_aluno}</span>,
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }: any) => <span className="font-medium">{row.original.nome}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "situacao_atual",
      header: "Situação",
      cell: ({ row }: any) => (
        <StatusBadge color={row.original.situacao_atual === "Ativo" ? "green" : "red"}>
          {row.original.situacao_atual === "Ativo" ? "Ativo" : "Inativo"}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "pais",
      header: "País",
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex justify-end gap-2">
          <Link href={`/alunos/${row.original.id_aluno}/edit`}>
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
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Alunos Cadastrados</h1>
          <p className="mt-1 text-sm text-gray-500">Lista de todos os alunos cadastrados no sistema.</p>
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
      
      {/* Filter controls */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Buscar por nome, email ou documento..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="situacao_atual" className="block text-sm font-medium mb-1">Situação</Label>
              <Select 
                value={filters.situacao_atual} 
                onValueChange={(value) => handleFilterChange('situacao_atual', value)}
              >
                <SelectTrigger id="situacao_atual">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="pais" className="block text-sm font-medium mb-1">País</Label>
              <Select 
                value={filters.pais} 
                onValueChange={(value) => handleFilterChange('pais', value)}
              >
                <SelectTrigger id="pais">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="Portugal">Portugal</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={data?.pagination?.totalPages}
        onPaginationChange={(page, pageSize) => setPage(page)}
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.pagination?.total}
      />
      
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
