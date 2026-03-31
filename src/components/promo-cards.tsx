"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/app/lib/store";

export function PromoCards() {
  const { isLoaded, products } = useStore();

  if (!isLoaded) return null;

  if (products.length === 0) return null;

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
        {products.map((item) => {
          const imgSrc = item.imageUrl || `https://picsum.photos/seed/${item.id}/400/250`;
          return (
            <Card key={item.id} className="overflow-hidden border-border bg-card hover:shadow-xl transition-all hover:scale-[1.02] flex flex-col">
              <div className="relative h-48 w-full bg-muted">
                <Image 
                  src={imgSrc} 
                  alt={item.title} 
                  fill 
                  className="object-cover" 
                  data-ai-hint={item.imageHint || "product"}
                />
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
                <Button 
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11"
                >
                  <a href={item.checkoutUrl} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" /> COMPRAR AGORA
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
