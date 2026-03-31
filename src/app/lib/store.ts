"use client";

import { useState, useEffect } from "react";

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  necessaryLinks: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  checkoutUrl: string;
  imageHint: string;
  imageUrl?: string;
}

export interface Settings {
  globalPassword: string;
  adminUser: string;
  adminPassword: string;
}

export const INITIAL_SETTINGS: Settings = {
  globalPassword: "Dc2026gp",
  adminUser: "midsz",
  adminPassword: "012706",
};

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Como começar no Discord",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    necessaryLinks: "Link do Discord: https://discord.gg/example\nGuia de início: https://example.com/guide",
  },
];

export function useStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    const storedVideos = localStorage.getItem("ldr_videos");
    const storedProducts = localStorage.getItem("ldr_products");
    const storedUsers = localStorage.getItem("ldr_users");
    const storedSettings = localStorage.getItem("ldr_settings");

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    else setVideos(INITIAL_VIDEOS);

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    else setProducts([]);

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (
        parsed.adminUser !== INITIAL_SETTINGS.adminUser || 
        parsed.adminPassword !== INITIAL_SETTINGS.adminPassword
      ) {
        setSettings(INITIAL_SETTINGS);
      } else {
        setSettings(parsed);
      }
    } else {
      setSettings(INITIAL_SETTINGS);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ldr_videos", JSON.stringify(videos));
      localStorage.setItem("ldr_products", JSON.stringify(products));
      localStorage.setItem("ldr_users", JSON.stringify(users));
      localStorage.setItem("ldr_settings", JSON.stringify(settings));
    }
  }, [videos, products, users, settings, isLoaded]);

  const addVideo = (v: Omit<Video, "id">) => {
    setVideos([...videos, { ...v, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateVideo = (id: string, updated: Partial<Video>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...updated } : v)));
  };

  const removeVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const addProduct = (p: Omit<Product, "id">) => {
    setProducts([...products, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const registerUser = (email: string) => {
    if (!users.includes(email)) {
      setUsers([...users, email]);
    }
  };

  const updateGlobalPassword = (newPass: string) => {
    setSettings({ ...settings, globalPassword: newPass });
  };

  return {
    isLoaded,
    videos,
    products,
    users,
    settings,
    addVideo,
    updateVideo,
    removeVideo,
    addProduct,
    updateProduct,
    removeProduct,
    registerUser,
    updateGlobalPassword,
  };
}
