import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CadastroAluno = lazy(() => import("@/pages/CadastroAluno"));
const Alunos = lazy(() => import("@/pages/Alunos"));
const Integracoes = lazy(() => import("@/pages/Integracoes"));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const WebSocketDemo = lazy(() => import("@/pages/WebSocketDemo"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-full min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function Router() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/cadastro" component={CadastroAluno} />
          <Route path="/alunos" component={Alunos} />
          <Route path="/integracoes" component={Integracoes} />
          <Route path="/configuracoes" component={Configuracoes} />
          <Route path="/websocket" component={WebSocketDemo} />
          <Route path="/alunos/:id/edit" component={CadastroAluno} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
