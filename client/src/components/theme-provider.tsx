"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children,
  defaultTheme = "dark",
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme={defaultTheme}
      // Removi forcedTheme para permitir que o usuário troque o tema
    >
      {children}
    </NextThemesProvider>
  )
}