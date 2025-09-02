export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readTime: number; // in minutes
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}
