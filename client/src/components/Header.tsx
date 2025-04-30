import { BellIcon, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  pageTitle: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ pageTitle, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  return (
    <>
      {/* Mobile top menu */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary-900 border-b border-primary-800 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button 
          type="button" 
          className="-m-2.5 p-2.5 text-primary-200 hover:text-primary-100 transition-colors duration-150 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Abrir menu</span>
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">{pageTitle}</div>
        <Avatar className="h-8 w-8 ring-2 ring-primary-700">
          <AvatarImage src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
      
      {/* Desktop top navbar */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="relative flex flex-1" action="#" method="GET">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              className={cn(
                "block h-full w-full border-0 bg-gray-50 py-0 pl-10 pr-3 text-gray-900",
                "focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:bg-white focus:outline-none",
                "sm:text-sm rounded-md transition-all duration-200"
              )}
              placeholder="Buscar alunos..." 
              type="search" 
              name="search"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-500 hover:text-primary-600 transition-colors duration-150">
              <span className="sr-only">Ver notificações</span>
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:flex lg:items-center lg:gap-x-4">
                <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700" aria-hidden="true">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
