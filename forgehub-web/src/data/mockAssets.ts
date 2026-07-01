// src/data/mockAssets.ts
import { Asset } from "../types";

export const mockAssets: Asset[] = [
  {
    id: "1",
    title: "Sample Asset One",
    description: "A short description for asset one.",
    file_url: "https://via.placeholder.com/600x400",
    thumbnail_url: "https://via.placeholder.com/300x200",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sample Asset Two",
    description: "Another description, showcasing a different asset.",
    file_url: "https://via.placeholder.com/600x400",
    thumbnail_url: "https://via.placeholder.com/300x200",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Sample Asset Three",
    description: "Yet another asset for the mock list.",
    file_url: "https://via.placeholder.com/600x400",
    thumbnail_url: "https://via.placeholder.com/300x200",
    created_at: new Date().toISOString(),
  },
];
