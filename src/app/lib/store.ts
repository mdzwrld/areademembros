
"use client";

import { useState, useEffect } from "react";

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  necessaryLinks: string;
}

export interface Settings {
  globalPassword: string;
  adminPassword: string;
}

export const INITIAL_SETTINGS: Settings = {
  globalPassword: "123456",
  adminPassword: "admin",
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
  const [users, setUsers] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    const storedVideos = localStorage.getItem("ldr_videos");
    const storedUsers = localStorage.getItem("ldr_users");
    const storedSettings = localStorage.getItem("ldr_settings");

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    else setVideos(INITIAL_VIDEOS);

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedSettings) setSettings(JSON.parse(storedSettings));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ldr_videos", JSON.stringify(videos));
      localStorage.setItem("ldr_users", JSON.stringify(users));
      localStorage.setItem("ldr_settings", JSON.stringify(settings));
    }
  }, [videos, users, settings, isLoaded]);

  const addVideo = (v: Omit<Video, "id">) => {
    setVideos([...videos, { ...v, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateVideo = (id: string, updated: Partial<Video>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...updated } : v)));
  };

  const removeVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const registerUser = (email: string) => {
    if (!users.includes(email)) {
      setUsers([...users, email]);
      // Here we would normally "send an email" with settings.globalPassword
    }
  };

  const updateGlobalPassword = (newPass: string) => {
    setSettings({ ...settings, globalPassword: newPass });
  };

  return {
    isLoaded,
    videos,
    users,
    settings,
    addVideo,
    updateVideo,
    removeVideo,
    registerUser,
    updateGlobalPassword,
  };
}
