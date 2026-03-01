
export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  features: string[];
  category: string;
  tags: string[];
  pricing: 'Free' | 'Freemium' | 'Paid';
  websiteUrl: string;
  logoUrl: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  createdAt: string;
  status?: 'active' | 'pending' | 'rejected';
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  integrations?: string[];
  targetAudience?: string;
  apiAvailable?: boolean;
  mobileApp?: boolean;
  supportType?: string;
}

export interface Author {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface TOCItem {
  id: string;
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  date: string;
  imageUrl: string;
  category: 'AI News' | 'AI Tools Reviews' | 'AI Tutorials' | 'Industry Updates';
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  toc?: TOCItem[];
  relatedPosts?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export type Theme = 'light' | 'dark';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'editor';
}

export interface SEOSettings {
  siteUrl: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  bingVerification: string;
  yandexVerification: string;
  baiduVerification: string;
  pinterestVerification: string;
  facebookDomainVerification: string;
  robotsTxt: string;
  sitemapUrl: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  isEnabled: boolean;
  code: string;
}

export interface AdSettings {
  adSenseClientId: string;
  placements: {
    header: AdPlacement;
    footer: AdPlacement;
    blogContent: AdPlacement;
    toolDirectory: AdPlacement;
  };
}

export interface SiteSettings {
  seo: SEOSettings;
  ads: AdSettings;
}

export interface ProgrammaticComparison {
  id: string;
  slug: string;
  tool_1_id: string;
  tool_2_id: string;
  tool_3_id?: string;
  status: 'pending' | 'generated' | 'published';
  ai_content: string;
  seo_title: string;
  seo_description: string;
  faq_schema: any;
  created_at: string;
  updated_at: string;
  // Joined data
  tool1?: AITool;
  tool2?: AITool;
  tool3?: AITool;
}
