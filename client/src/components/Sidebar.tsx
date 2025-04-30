import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BellIcon, ChartLine, UserPlus, Users, Plug, Sliders, LogOut, Ship } from "lucide-react";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: ChartLine, current: location === "/" },
    { name: "Cadastrar Aluno", href: "/cadastro", icon: UserPlus, current: location === "/cadastro" },
    { name: "Alunos", href: "/alunos", icon: Users, current: location === "/alunos" },
    { name: "Integrações", href: "/integracoes", icon: Plug, current: location === "/integracoes" },
    { name: "Configurações", href: "/configuracoes", icon: Sliders, current: location === "/configuracoes" },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-900 shadow-xl px-6 border-r border-primary-800">
          <div className="flex h-20 shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center gap-2">
                <Ship className="h-8 w-8 text-primary-300" />
                <span className="text-xl font-bold text-white">Tripulante</span>
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.current
                            ? "bg-primary-700 text-white shadow-sm"
                            : "text-primary-100 hover:bg-primary-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors duration-150"
                        )}
                      >
                        <item.icon 
                          className={cn(
                            "h-6 w-6 shrink-0",
                            item.current ? "text-primary-100" : "text-primary-300 group-hover:text-primary-100 transition-colors duration-150"
                          )} 
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto pb-6">
                <a
                  href="#"
                  className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-100 hover:bg-primary-800 hover:text-white transition-colors duration-150"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-primary-300 group-hover:text-primary-100 transition-colors duration-150" />
                  Sair
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-primary-900 shadow-xl lg:hidden transition-transform duration-300 ease-in-out border-r border-primary-800", 
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
          <div className="flex h-20 shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center gap-2">
                <Ship className="h-8 w-8 text-primary-300" />
                <span className="text-xl font-bold text-white">Tripulante</span>
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.current
                            ? "bg-primary-700 text-white shadow-sm"
                            : "text-primary-100 hover:bg-primary-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors duration-150"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon 
                          className={cn(
                            "h-6 w-6 shrink-0",
                            item.current ? "text-primary-100" : "text-primary-300 group-hover:text-primary-100 transition-colors duration-150"
                          )} 
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto pb-6">
                <a
                  href="#"
                  className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-100 hover:bg-primary-800 hover:text-white transition-colors duration-150"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-primary-300 group-hover:text-primary-100 transition-colors duration-150" />
                  Sair
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
