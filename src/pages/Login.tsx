import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [email, setEmail] = useState("client@demo.com");
  const [password, setPassword] = useState("demo1234");

  useEffect(() => {
    if (user) nav(`/${user.role}`, { replace: true });
  }, [user, nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) return toast.error("Invalid credentials");
    toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
    nav(loc.state?.from || `/${u.role}`, { replace: true });
  };

  const quick = (e: string) => { setEmail(e); setPassword("demo1234"); };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-1 bg-gradient-surface p-10 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative z-10">
          <Logo size={40} />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary mb-4">
            <Sparkles className="h-3 w-3" /> AI-powered material recommendations
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Build smarter.<br />
            <span className="gradient-text">Spend wiser.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            One workspace for clients, contractors and admins — with intelligent
            cost estimation and material picks tuned to your budget.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md">
          {["Cement", "Bricks", "Steel"].map((t) => (
            <div key={t} className="glass-card p-3 text-center text-xs text-muted-foreground">{t}</div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 grid place-items-center p-5 sm:p-10">
        <Card className="w-full max-w-md p-6 sm:p-8 glass-card">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="font-display text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Use a demo account or your own.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { r: "Client", e: "client@demo.com" },
                { r: "Contractor", e: "contractor@demo.com" },
                { r: "Admin", e: "admin@demo.com" },
              ].map((q) => (
                <Button key={q.e} variant="outline" size="sm" type="button" onClick={() => quick(q.e)}>
                  {q.r}
                </Button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
