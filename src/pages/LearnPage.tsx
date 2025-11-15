import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LearningCard from "@/components/LearningCard";
import BootcampCard from "@/components/BootcampCard";
import ArticleCard from "@/components/ArticleCard";
import { learnArticles } from "@/modules/learn/articles";
import { ReactNode } from "react";
import nautilusThumbnail from "@/assets/nautilus.png";
import sealThumbnail from "@/assets/seal.png";
import walrusThumbnail from "@/assets/walrus.png";

const defaultDescription =
  "Educational resources aggregated by the First Movers Community. Discover to expand your knowledge about blockchain and Sui.";

const getIconNode = (icon?: string, fallback?: string): ReactNode => (
  <div className="w-10 h-10 flex items-center justify-center text-2xl">
    {icon || fallback || "📘"}
  </div>
);

const articleThumbnails: Record<string, string> = {
  nautilus: nautilusThumbnail,
  seal: sealThumbnail,
  walrus: walrusThumbnail,
};

const LearnPage = () => {
  const featuredArticles = learnArticles.slice(0, 3);
  const articlesForGrid = learnArticles;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-6 py-16">
          <h1 className="text-5xl font-bold mb-12">Learn Sui Development</h1>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Bootcamp Feature */}
            <BootcampCard />
            
            {/* Learning Resources */}
<div className="space-y-6">
              {featuredArticles.length ? (
                featuredArticles.map((article) => (
                  <LearningCard
                    key={article.slug}
                    image={article.heroImage || articleThumbnails[article.slug]}
                    title={article.title}
                    description={article.description || defaultDescription}
                    to={`/learn/article/${article.slug}`}
                  />
                ))
              ) : (
                <div className="text-muted-foreground">
                  Stay tuned! New learning resources are coming soon.
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Technical Articles Section */}
        <section className="container px-6 py-16">
          <h2 className="text-4xl font-bold mb-12">Technical Articles</h2>
          
          {articlesForGrid.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesForGrid.map((article) => (
                <ArticleCard
                  key={article.slug}
                  image={article.heroImage || articleThumbnails[article.slug]}
                  title={article.title}
                  description={article.description || defaultDescription}
                  slug={article.slug}
                  icon={article.icon}
                />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">
              Articles will appear here once they are published.
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LearnPage;
