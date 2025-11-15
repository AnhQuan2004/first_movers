import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LearningCardProps {
  icon?: ReactNode;
  image?: string;
  title: string;
  description: string;
  buttonText?: string;
  to: string;
}

const LearningCard = ({
  icon,
  image,
  title,
  description,
  buttonText = "Learn now",
  to,
}: LearningCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
<div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {image ? (
                <img src={image} alt={title} className="w-10 h-10 rounded-md object-cover" />
              ) : (
                icon
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          </div>
          <Link to={to}>
            <Button variant="default" size="sm" className="flex-shrink-0">
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningCard;
