
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { settings } = useStore();
  const { toast } = useToast();
  const [password, setPassword] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === settings.adminPassword) {
      localStorage.setItem("ldr_admin_auth", "true");
      router.push("/admin");
    } else {
      toast({ title: "Senha inválida", description: "Senha de administrador incorreta.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm border-secondary/20 bg-card shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole className="h-6 w-6 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-secondary">Acesso Administrativo</CardTitle>
          <CardDescription>Painel restrito para gestão de conteúdo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pass">Senha Admin</Label>
              <Input 
                id="pass" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira a senha mestra"
              />
            </div>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
              Entrar no Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
