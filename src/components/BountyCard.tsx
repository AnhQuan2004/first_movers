import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

type BountyCardProps = {
  title: string;
  category: string;
  quests: number;
  dueIn: string;
  reward: number;
  currency: string;
};

const BountyCard = ({ title, category, quests, dueIn, reward, currency }: BountyCardProps) => {
  return (
    <Card className="cursor-pointer border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/10 p-4 transition hover:border-blue-500/40">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{category}</p>
          <h3 className="mt-1 text-sm font-semibold text-white">{title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
            <Users className="h-3 w-3" />
            <span>{quests} quests</span>
          </div>
          <span className="text-muted-foreground/80">Due in {dueIn}</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Reward</span>
          <span className="text-base font-semibold text-blue-300">{reward.toLocaleString()} {currency}</span>
        </div>
      </div>
    </Card>
  );
};

export default BountyCard;
