"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, Video, Product } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit3, Save, Sparkles, Users, Video as VideoIcon, Settings as SettingsIcon, LogOut, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestVideoLinks } from "@/ai/flows/admin-video-link-suggester";

export default function AdminPage() {
  const router = useRouter();
  const { isLoaded, videos, products, users, settings, addVideo, updateVideo, removeVideo, addProduct, updateProduct, removeProduct, updateGlobalPassword } = useStore();
  const { toast } = useToast();

  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState({ title: "", youtubeUrl: "", necessaryLinks: "" });
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", checkoutUrl: "", imageHint: "discord" });

  const [globalPass, setGlobalPass] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("ldr_admin_auth");
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (settings.globalPassword) setGlobalPass(settings.globalPassword);
  }, [settings]);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtubeUrl) return;
    addVideo(newVideo);
    setNewVideo({ title: "", youtubeUrl: "", necessaryLinks: "" });
    toast({ title: "Vídeo adicionado com sucesso!" });
  };

  const handleUpdateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    updateVideo(editingVideo.id, editingVideo);
    setEditingVideo(null);
    toast({ title: "Vídeo atualizado!" });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.checkoutUrl) return;
    addProduct(newProduct);
    setNewProduct({ title: "", description: "", checkoutUrl: "", imageHint: "discord" });
    toast({ title: "Produto adicionado com sucesso!" });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    toast({ title: "Produto atualizado!" });
  };

  const handleUpdatePass = () => {
    updateGlobalPassword(globalPass);
    toast({ title: "Senha global atualizada!" });
  };

  const handleSuggestLinks = async (title: string, desc: string, target: 'new' | 'edit') => {
    setSuggesting(true);
    try {
      const result = await suggestVideoLinks({ videoTitle: title, videoDescription: desc });
      if (target === 'new') {
        setNewVideo({ ...newVideo, necessaryLinks: result });
      } else if (editingVideo) {
        setEditingVideo({ ...editingVideo, necessaryLinks: result });
      }
      toast({ title: "Links sugeridos pela IA!" });
    } catch (e) {
      toast({ title: "Erro na IA", variant: "destructive" });
    } finally {
      setSuggesting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-headline font-bold text-secondary flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" /> Painel Admin
        </h1>
        <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("ldr_admin_auth"); router.push("/admin/login"); }}>
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger value="videos">
              <VideoIcon className="h-4 w-4 mr-2" /> Vídeos
            </TabsTrigger>
            <TabsTrigger value="products">
              <ShoppingBag className="h-4 w-4 mr-2" /> Produtos
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="h-4 w-4 mr-2" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-headline">Adicionar Novo Vídeo</CardTitle>
                <CardDescription>Preencha os dados abaixo para publicar um novo conteúdo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título do Vídeo</Label>
                      <Input 
                        value={newVideo.title} 
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} 
                        placeholder="Ex: Como configurar o Nitro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link do YouTube</Label>
                      <Input 
                        value={newVideo.youtubeUrl} 
                        onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })} 
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Links Necessários</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="text-primary hover:text-primary-foreground hover:bg-primary border-primary/20"
                        disabled={!newVideo.title || suggesting}
                        onClick={() => handleSuggestLinks(newVideo.title, "Gere links para o vídeo.", 'new')}
                      >
                        <Sparkles className="h-3 w-3 mr-1" /> IA Sugerir
                      </Button>
                    </div>
                    <Textarea 
                      value={newVideo.necessaryLinks} 
                      onChange={(e) => setNewVideo({ ...newVideo, necessaryLinks: e.target.value })} 
                      placeholder="Um link por linha"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Vídeo
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-lg font-headline font-bold">Vídeos Existentes</h3>
              {videos.map(video => (
                <Card key={video.id} className="border-border bg-card">
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted p-2 rounded">
                        <VideoIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{video.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{video.youtubeUrl}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingVideo(video)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeVideo(video.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-headline">Adicionar Novo Produto (Fornecedor)</CardTitle>
                <CardDescription>Crie um card de oferta com link direto para o checkout.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título do Produto</Label>
                      <Input 
                        value={newProduct.title} 
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} 
                        placeholder="Ex: Nitro Trimensal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link do Checkout</Label>
                      <Input 
                        value={newProduct.checkoutUrl} 
                        onChange={(e) => setNewProduct({ ...newProduct, checkoutUrl: e.target.value })} 
                        placeholder="https://pay.exemplo.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Palavra-chave para Imagem (IA)</Label>
                      <Input 
                        value={newProduct.imageHint} 
                        onChange={(e) => setNewProduct({ ...newProduct, imageHint: e.target.value })} 
                        placeholder="Ex: nitro, gaming, shop"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição curta</Label>
                    <Textarea 
                      value={newProduct.description} 
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                      placeholder="Destaque as principais vantagens"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-lg font-headline font-bold">Produtos Existentes</h3>
              {products.map(product => (
                <Card key={product.id} className="border-border bg-card">
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted p-2 rounded">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{product.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{product.checkoutUrl}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-headline">Emails Cadastrados</CardTitle>
                <CardDescription>Lista de todos os usuários que acessaram o sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y border-border">
                  {users.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground">Nenhum usuário cadastrado.</p>
                  ) : (
                    users.map((email, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <span className="text-sm font-medium">{email}</span>
                        <span className="text-[10px] uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Ativo</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-headline">Segurança e Sistema</CardTitle>
                <CardDescription>Configure a senha global que os usuários usam para o primeiro acesso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Senha Global Padrão</Label>
                  <div className="flex gap-2">
                    <Input value={globalPass} onChange={(e) => setGlobalPass(e.target.value)} type="text" />
                    <Button onClick={handleUpdatePass} className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90">
                      <Save className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Senha atual necessária para login dos clientes.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {editingVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Editar Vídeo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input 
                    value={editingVideo.title} 
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input 
                    value={editingVideo.youtubeUrl} 
                    onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Links Necessários</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    disabled={suggesting}
                    onClick={() => handleSuggestLinks(editingVideo.title, "Gere links.", 'edit')}
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Sugerir
                  </Button>
                </div>
                <Textarea 
                  value={editingVideo.necessaryLinks} 
                  onChange={(e) => setEditingVideo({ ...editingVideo, necessaryLinks: e.target.value })} 
                  rows={6}
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="ghost" onClick={() => setEditingVideo(null)}>Cancelar</Button>
                <Button onClick={handleUpdateVideo} className="bg-primary text-primary-foreground font-bold">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Editar Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input 
                    value={editingProduct.title} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Checkout URL</Label>
                  <Input 
                    value={editingProduct.checkoutUrl} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, checkoutUrl: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Palavra-chave para Imagem</Label>
                  <Input 
                    value={editingProduct.imageHint} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageHint: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea 
                  value={editingProduct.description} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} 
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="ghost" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                <Button onClick={handleUpdateProduct} className="bg-primary text-primary-foreground font-bold">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
