import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, BarChart3, Camera, MessageSquare, Sparkles, Users } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}`} replace />;

  const features = [
    { icon: Sparkles, title: "AI Material Recommender", text: "Smart suggestions tuned to your budget, area and quality preference." },
    { icon: BarChart3, title: "Real-time Cost Estimation", text: "Instant material, labor and finishing breakdown with charts." },
    { icon: Camera, title: "Daily Progress Tracking", text: "Photos, videos and timeline updates from your contractor." },
    { icon: MessageSquare, title: "Built-in Chat", text: "Talk to your contractor or client without leaving the app." },
    { icon: Users, title: "Role-based Workspaces", text: "Tailored dashboards for clients, contractors and admins." },
  ];

  return (
    <div className="min-h-screen">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Link to="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <section className="container pt-10 sm:pt-20 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary mb-6 animate-fade-in">
          <Sparkles className="h-3 w-3" /> Smart Construction Management
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]">
          Build smarter projects with{" "}
          <span className="gradient-text">AI-powered material picks.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          BuildSmart estimates costs, recommends materials and tracks progress —
          all in one premium workspace for clients, contractors and admins.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
            <Link to="/signup">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Try a demo account</Link>
          </Button>
        </div>
      </section>

      <section className="container pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 hover:shadow-elegant transition-all">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BuildSmart. Crafted for modern construction teams.
      </footer>
    </div>
  );
};

export default Index;
