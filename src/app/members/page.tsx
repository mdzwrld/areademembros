
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromoCards } from "@/components/promo-cards";
import { LogOut, ExternalLink, PlayCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function MembersPage() {
  const router = useRouter();
  const { isLoaded, videos } = useStore();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("ldr_auth");
    if (!auth) {
      router.push("/");
    } else {
      setUser(JSON.parse(auth));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ldr_auth");
    router.push("/");
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-headline font-bold text-primary tracking-tight">Lucro Discord Rápido</h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-headline font-bold mb-4 tracking-tighter">
            Lucro Discord Rápido
          </h2>
          <p className="text-muted-foreground text-lg">Assista aos treinamentos exclusivos e utilize os links abaixo para maximizar seus resultados.</p>
        </div>

        <section className="space-y-12">
          {videos.length === 0 ? (
            <Card className="border-dashed py-12 text-center text-muted-foreground">
              <p>Nenhum vídeo disponível no momento.</p>
            </Card>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="overflow-hidden border-primary/10 shadow-lg bg-card/60 backdrop-blur-sm group">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                    <PlayCircle className="text-primary h-6 w-6" />
                    {video.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video relative w-full">
                    <iframe
                      src={getYoutubeEmbedUrl(video.youtubeUrl)}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <ExternalLink className="h-4 w-4" />
                      <h3>Links Necessários</h3>
                    </div>
                    <Separator className="bg-border/50" />
                    <div className="bg-background/40 p-4 rounded-lg border border-border/40 whitespace-pre-line text-sm leading-relaxed">
                      {video.necessaryLinks || "Nenhum link necessário para este vídeo."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>

      <div className="bg-muted/10 mt-16 pb-16">
        <PromoCards />
      </div>

      <footer className="py-8 border-t border-border/40 text-center text-muted-foreground text-xs">
        <p>© 2024 Lucro Discord Rápido. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
