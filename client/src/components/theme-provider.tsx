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
      enableSystem={false}
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  )
}