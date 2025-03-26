import type { TableColumn, Row } from "@nuxt/ui";

export interface Tag {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  cover_img: string;
  status: "published" | "draft" | "scheduled";
  publish_at: string;
  views: number;
  category_id: number;
  category: Category;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface PostInput {
  title: string;
  content: string;
  cover_img: string;
  status: "published" | "draft" | "scheduled";
  publish_at: string;
  category_id: number;
  tag_ids?: number[];
}

// For compatibility with the UTable component
export type PostTableColumn = TableColumn<Post>;

// Helper type for accessing row data
export type PostRow = Row<Post> & Post;
