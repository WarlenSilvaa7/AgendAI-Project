import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "theme";

/**
 * Hook para gerenciar tema (light/dark).
 * - Persiste em localStorage
 * - Aplica a classe `dark` no <html>
 * - Respeita a preferência do sistema quando não há preferência salva
 */
export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved as Theme;
      if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch (e) {
      // noop
    }
    return "light";
  });

  // Aplica a classe `dark` no document.documentElement e persiste a escolha
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // noop
    }
  }, [theme]);

  // Se o usuário NÃO definiu uma preferência explícita, acompanha mudança do sistema
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return; // preferência explícita -> não ouvir

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");

      if (mq.addEventListener) mq.addEventListener("change", handler);
      else mq.addListener(handler);

      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else mq.removeListener(handler);
      };
    } catch (e) {
      // noop
    }
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, setTheme } as const;
}
