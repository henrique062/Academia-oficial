import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/alunos":
        return "Alunos";
      case "/cadastro":
        return "Cadastrar Aluno";
      case "/integracoes":
        return "Integrações";
      case "/configuracoes":
        return "Configurações";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-full">
      <div className="flex h-full">
        {/* Sidebar - desktop */}
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Main content */}
        <div className="lg:pl-72 flex flex-col w-full">
          <Header 
            pageTitle={getPageTitle()} 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
          
          {/* Dashboard content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
