
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, settings, registerUser } = useStore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("ldr_auth");
    if (auth) {
      router.push("/members");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.includes("@")) {
      toast({ title: "Email inválido", description: "Por favor, insira um email válido.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (password === "") {
      // First step: Register the user if they don't have a password input yet
      registerUser(email);
      toast({ 
        title: "Registro automático realizado!", 
        description: `A senha padrão global é: ${settings.globalPassword}. Por favor, use-a para entrar.`, 
      });
      setLoading(false);
      return;
    }

    if (password === settings.globalPassword) {
      localStorage.setItem("ldr_auth", JSON.stringify({ email }));
      router.push("/members");
    } else {
      toast({ title: "Senha incorreta", description: "A senha inserida não é válida.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[url('https://picsum.photos/seed/bg/1920/1080')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md relative z-10 border-primary/20 bg-card/95 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">Lucro Discord Rápido</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse sua área exclusiva de membros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Senha
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Insira sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Primeira vez? Insira o email, clique em entrar e você receberá a senha padrão.
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-bold" disabled={loading}>
              {loading ? "Processando..." : "Entrar Agora"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">© 2024 Lucro Discord Rápido. Todos os direitos reservados.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
