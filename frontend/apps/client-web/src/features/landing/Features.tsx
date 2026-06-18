import Card from "./Card";
import {
  Zap,
  Motorbike,
  MessageCircleQuestionMark,
  BanknoteArrowDown,
} from "lucide-react";
export default function Feature() {
  const features = [
    {
      title: "Fast Booking",
      desc: "Find and book a bike in just a few minutes with our optimized and intuitive interface.",
      icon: <Zap className="w-10 h-10 text-white" />,
    },
    {
      title: "Transparent Pricing",
      desc: "Full disclosure of costs with no hidden fees.",
      icon: <BanknoteArrowDown className="w-10 h-10 text-white" />,
    },
    {
      title: "Diverse Bike Selection",
      desc: "Wide range of options from standard to premium bikes to suit every need.",
      icon: <Motorbike className="w-10 h-10 text-white" />,
    },
    {
      title: "24/7 Customer Support",
      desc: "Our support team is always ready to assist you throughout your bike rental experience.",
      icon: <MessageCircleQuestionMark className="w-10 h-10 text-white" />,
    },
  ];
  return (
    <section id="features" className="space-y-16">
      <div className="max-w-3xl mx-auto text-center text-muted-foreground">
        <p className="uppercase tracking-[0.3em] mb-4 text-sm">Why Choose Us</p>

        <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
          fast, transparent, and modern
        </h2>

        <p className="mt-6 text-lg">
          We provide a convenient, transparent, and optimized bike rental
          platform from search to booking.
        </p>
      </div>

      {/* Feature Cards */}
      <div
        id="features"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {features.map((item, index) => (
          <Card
            index={index}
            title={item.title}
            desc={item.desc}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
