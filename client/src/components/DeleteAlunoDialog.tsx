import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface DeleteAlunoDialogProps {
  alunoId: number;
  alunoNome: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DeleteAlunoDialog({
  alunoId,
  alunoNome,
  isOpen,
  setIsOpen,
  onSuccess,
}: DeleteAlunoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!alunoId) return;
    
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/alunos/${alunoId}`);
      
      toast({
        title: "Aluno excluído",
        description: `${alunoNome} foi excluído com sucesso.`,
        variant: "default",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error deleting aluno:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o aluno. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Aluno</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o aluno <strong>{alunoNome}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
