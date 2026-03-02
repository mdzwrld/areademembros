
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const promoItems = [
  {
    id: "discord-nitro",
    title: "📦 Produtos Discord (DOS TOP 01 DA GGMAX)",
    description: "Fornecedor testado e aprovado de Nitro Trimensal, Mensal, Impulsos, Nitradas, Membros e etc.",
    price: "",
  },
  {
    id: "tiktok-shop",
    title: "📦 Contas TikTok Shop e Monetizados – R$ 32,90",
    description: "de 7 fornecedores de TikTok Shop e monetizadas, aulas de como comprar nos fornecedores + suporte prioritário.",
    price: "R$ 32,90",
  },
  {
    id: "gaming-currency",
    title: "📦 Valorant Points, Vbucks, Robux – R$ 38,90",
    description: "Fornecedor testado e aprovado por nossa equipe e + de 100 clientes (Bem mais barato que nos jogos)",
    price: "R$ 38,90",
  },
  {
    id: "roblox",
    title: "📦 Produtos de Roblox – R$ 36,90",
    description: "Fornecedor testado e aprovado de Roblox (Jogos mais famosos)",
    price: "R$ 36,90",
  },
  {
    id: "steam",
    title: "📦 Produtos Steam (DOS TOP 01 DA GGMAX) – R$ 32,90",
    description: "Fornecedor testado e aprovado de Steam Key (por R$ 0,40) e Steam offline (Free)",
    price: "R$ 32,90",
  },
  {
    id: "streaming",
    title: "📦 Streaming e Assinaturas (DOS TOP 01 DA GGMAX) – R$ 98,90",
    description: "de 10 fornecedores testados e aprovados de Streaming compartilhados (a partir de R$0,20) e Assinaturas full acesso (a partir de R$10,00) – ESTOQUE INFINITO",
    price: "R$ 98,90",
  },
  {
    id: "game-accounts",
    title: "📦 Contas de Fortnite, Valorant, Roblox, Clash Royale – R$ 56,90",
    description: "Contas full acesso e no precinho, contas que podem mudar email e senha.",
    price: "R$ 56,90",
  },
  {
    id: "supercell",
    title: "📦 Fornecedor Supercell – R$ 32,90",
    description: "Fornecedor testado e aprovado de Clash Royale, Clash of Clans e Brawl Stars.",
    price: "R$ 32,90",
  },
];

export function PromoCards() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-bold text-primary mb-4">
          🔥 Nossos Fornecedores Testados e Aprovados
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Acesse os melhores preços do mercado com fornecedores de confiança selecionados por nossa equipe.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoItems.map((item) => {
          const placeholder = PlaceHolderImages.find(p => p.id === item.id);
          return (
            <Card key={item.id} className="overflow-hidden border-border bg-card hover:shadow-xl transition-all hover:scale-[1.02] flex flex-col">
              <div className="relative h-48 w-full bg-muted">
                {placeholder && (
                   <Image 
                    src={placeholder.imageUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                    data-ai-hint={placeholder.imageHint}
                   />
                )}
                <div className="absolute top-2 right-2">
                  <Package className="text-primary h-6 w-6 drop-shadow-md" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-headline leading-tight">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11">
                  <ShoppingCart className="mr-2 h-4 w-4" /> COMPRAR AGORA
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
