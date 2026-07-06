
"use client";

import { useCollection, useDoc, useFirestore } from "@/firebase";
import { collection, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  necessaryLinks: string;
  createdAt?: any;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  checkoutUrl: string;
  imageHint: string;
  imageUrl?: string;
  createdAt?: any;
}

export interface Settings {
  globalPassword: string;
}

export function useStore() {
  const firestore = useFirestore();

  // Queries memorizadas para evitar re-renderizações infinitas
  const videosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "videos"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), orderBy("registeredAt", "desc"));
  }, [firestore]);

  const settingsDocRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "settings", "global");
  }, [firestore]);

  const { data: videos, loading: videosLoading } = useCollection<Video>(videosQuery);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { data: usersData, loading: usersLoading } = useCollection<{email: string}>(usersQuery);
  const { data: settings, loading: settingsLoading } = useDoc<Settings>(settingsDocRef);

  const users = useMemo(() => usersData?.map(u => u.email) || [], [usersData]);

  const addVideo = (v: Omit<Video, "id">) => {
    if (!firestore) return;
    const newDoc = doc(collection(firestore, "videos"));
    setDoc(newDoc, { ...v, createdAt: serverTimestamp() }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: "videos",
        operation: "create",
        requestResourceData: v
      }));
    });
  };

  const updateVideo = (id: string, updated: Partial<Video>) => {
    if (!firestore) return;
    setDoc(doc(firestore, "videos", id), updated, { merge: true }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: `videos/${id}`,
        operation: "update",
        requestResourceData: updated
      }));
    });
  };

  const removeVideo = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "videos", id)).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: `videos/${id}`,
        operation: "delete"
      }));
    });
  };

  const addProduct = (p: Omit<Product, "id">) => {
    if (!firestore) return;
    const newDoc = doc(collection(firestore, "products"));
    setDoc(newDoc, { ...p, createdAt: serverTimestamp() }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: "products",
        operation: "create",
        requestResourceData: p
      }));
    });
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    if (!firestore) return;
    setDoc(doc(firestore, "products", id), updated, { merge: true }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: `products/${id}`,
        operation: "update",
        requestResourceData: updated
      }));
    });
  };

  const removeProduct = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "products", id)).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: `products/${id}`,
        operation: "delete"
      }));
    });
  };

  const registerUser = (email: string) => {
    if (!firestore) return;
    const userDoc = doc(firestore, "users", email.replace(/\./g, "_"));
    setDoc(userDoc, { email, registeredAt: serverTimestamp() }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: `users/${email}`,
        operation: "create",
        requestResourceData: { email }
      }));
    });
  };

  const updateGlobalPassword = (newPass: string) => {
    if (!firestore) return;
    setDoc(doc(firestore, "settings", "global"), { globalPassword: newPass }, { merge: true }).catch(async (e) => {
      errorEmitter.emit("permission-error", new FirestorePermissionError({
        path: "settings/global",
        operation: "update",
        requestResourceData: { globalPassword: newPass }
      }));
    });
  };

  return {
    isLoaded: !videosLoading && !productsLoading && !settingsLoading,
    videos: videos || [],
    products: products || [],
    users: users || [],
    settings: settings || { globalPassword: "Dc2026gp" },
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
