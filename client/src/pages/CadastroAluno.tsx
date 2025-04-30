import { useQuery } from "@tanstack/react-query";
import { Params, useParams } from "wouter";
import AlunoForm from "@/components/AlunoForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function CadastroAluno() {
  const params = useParams<{ id: string }>();
  const isEditing = !!params?.id;
  
  // Fetch aluno data if editing
  const { data: aluno, isLoading } = useQuery({
    queryKey: [`/api/alunos/${params?.id}`],
    queryFn: async () => {
      if (!params?.id) return null;
      const response = await fetch(`/api/alunos/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch aluno");
      return response.json();
    },
    enabled: isEditing
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">
          {isEditing ? "Editar Aluno" : "Cadastrar Novo Aluno"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isEditing 
            ? "Atualize os dados do aluno no formulário abaixo." 
            : "Preencha os dados do aluno para cadastrá-lo no sistema."}
        </p>
      </div>
      
      {isEditing && isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <AlunoForm defaultValues={aluno} isEditing={isEditing} />
      )}
    </div>
  );
}
