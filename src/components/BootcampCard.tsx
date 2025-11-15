import { Card } from "@/components/ui/card";
import bootcampBanner from "../assets/walrus.jpg";

const BootcampCard = () => {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <div className="rounded-[32px] bg-gradient-to-br from-[#FF8A24] to-[#FF4E3D] p-8 text-center text-white">
        <div className="mb-8 overflow-hidden rounded-[28px] border border-white/20 shadow-2xl">
          <img
            src={bootcampBanner}
            alt="Sui Builders Intensive"
            className="w-full h-auto object-cover"
          />
        </div>
        <h2 className="text-4xl font-semibold tracking-tight">
          Sui Builders Intensive
        </h2>
      </div>
    </Card>
  );
};

export default BootcampCard;
