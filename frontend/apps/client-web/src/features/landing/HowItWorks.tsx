import Card from "./Card";
export default function HowItWorks() {
  const howItWorks = [
    {
      step: "01",
      title: "Find a Bike",
      desc: "Filter and find the bike that suits your needs.",
    },
    {
      step: "02",
      title: "Book Your Bike",
      desc: "Select your rental period, confirm your information, and complete the payment.",
    },
    {
      step: "03",
      title: "Pick Up Your Bike",
      desc: "Receive your bike quickly and start your journey.",
    },
  ];
  return (
    <section id="how-it-works">
      <div className="max-w-3xl mx-auto text-muted-foreground text-center mb-16">
        <p className=" uppercase tracking-[0.3em] mb-4 text-sm">How It Works</p>

        <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
          Rent a bike in just a few simple steps
        </h2>

        <p className="mt-6 text-lg">
          A fast, optimized process helps you save time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {howItWorks.map((item, index) => (
          <Card
            index={index}
            step={item.step}
            title={item.title}
            desc={item.desc}
          />
        ))}
      </div>
    </section>
  );
}
