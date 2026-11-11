import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Sessao {
  usuario: string | null;
  token: string | null;
  definir: (usuario: string, token: string) => void;
  sair: () => void;
}

export const useSessao = create<Sessao>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      definir: (usuario, token) => set({ usuario, token }),
      sair: () => set({ usuario: null, token: null }),
    }),
    { name: "picrewuai:sessao" },
  ),
);
