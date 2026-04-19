import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "@/lib/mockData";
import { store } from "@/lib/store";

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => User | null;
  signup: (name: string, email: string, password: string, role: User["role"]) => User | null;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => store.currentUser());

  useEffect(() => {
    const unsub = store.subscribe(() => setUser(store.currentUser()));
    return () => { unsub(); };
  }, []);

  const value: AuthCtx = {
    user,
    login: (e, p) => store.login(e, p),
    signup: (n, e, p, r) => store.signup(n, e, p, r),
    logout: () => store.logout(),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}
