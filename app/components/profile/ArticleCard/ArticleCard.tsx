"use client";

import React, { useState, useEffect } from "react";
import MagicalSkeletonLoader from "@/app/components/ui/MagicalSkeletonLoader";

interface Article {
  title: string;
  image: string;
  excerpt: string;
}

const ArticleCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Simulate an asynchronous API call.
    setTimeout(() => {
      setArticle({
        title: "Exploring the Universe",
        image: "https://placehold.co/400x200",
        excerpt:
          "Delve into the mysteries of space, from distant galaxies to the secrets of black holes.",
      });
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <MagicalSkeletonLoader loading={loading}>
      <div className="max-w-md mx-auto p-4 rounded flex flex-col">
        <img
          src={article?.image}
          alt="Article"
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold">{article?.title}</h3>
        <p className="text-gray-700 mt-2">{article?.excerpt}</p>
      </div>
    </MagicalSkeletonLoader>
  );
};

export default ArticleCard;
