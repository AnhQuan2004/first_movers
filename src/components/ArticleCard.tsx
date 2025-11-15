import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  image?: string;
  title: string;
  description: string;
  slug: string;
  icon?: string;
}

const ArticleCard = ({ image, title, description, slug, icon }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        {image ? (
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-900 to-purple-950">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-950">
            <span className="text-5xl">{icon ?? title.charAt(0)}</span>
          </div>
        )}
<div className="p-6 space-y-3">
  <h3 className="text-lg font-bold">{title}</h3>
  <p className="text-muted-foreground text-sm leading-relaxed">
    {description}
  </p>
  <Link to={`/learn/article/${slug}`}>
    <Button variant="default" size="sm">
      Learn more
    </Button>
  </Link>
</div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
