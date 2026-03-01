
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  ogImage, 
  ogType = 'website',
  canonicalUrl,
  author,
  publishedDate,
  tags
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Update OG Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && ogImage) ogImg.setAttribute('content', ogImage);

    const ogTyp = document.querySelector('meta[property="og:type"]');
    if (ogTyp) ogTyp.setAttribute('content', ogType);

    // Schema.org LD+JSON
    if (ogType === 'article') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": ogImage,
        "author": {
          "@type": "Person",
          "name": author
        },
        "datePublished": publishedDate,
        "description": description,
        "keywords": tags?.join(', ')
      });
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, description, ogImage, ogType, author, publishedDate, tags]);

  return null; // This component doesn't render anything UI-wise
};

export default SEO;
