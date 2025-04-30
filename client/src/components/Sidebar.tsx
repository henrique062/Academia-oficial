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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-950 px-6">
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
                            ? "bg-primary-800 text-white"
                            : "text-primary-200 hover:bg-primary-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-primary-200" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-200 hover:bg-primary-800 hover:text-white"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-primary-200" />
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
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-primary-950 lg:hidden transition-transform duration-300 ease-in-out", 
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
                            ? "bg-primary-800 text-white"
                            : "text-primary-200 hover:bg-primary-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-primary-200" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-200 hover:bg-primary-800 hover:text-white"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-primary-200" />
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
