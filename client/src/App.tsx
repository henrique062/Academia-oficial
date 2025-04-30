import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import CadastroAluno from "@/pages/CadastroAluno";
import Alunos from "@/pages/Alunos";
import Integracoes from "@/pages/Integracoes";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cadastro" component={CadastroAluno} />
        <Route path="/alunos" component={Alunos} />
        <Route path="/integracoes" component={Integracoes} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route path="/alunos/:id/edit" component={CadastroAluno} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
