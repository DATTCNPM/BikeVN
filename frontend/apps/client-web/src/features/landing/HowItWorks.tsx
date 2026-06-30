import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30, y: 10 }, // Đẩy x nhẹ sang bên trái tạo cảm giác dòng chảy (Flow)
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 14 },
    },
  } as const;

  return (
    <section id="how-it-works" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-muted-foreground text-center mb-16"
      >
        <p className="uppercase tracking-[0.3em] mb-4 text-sm text-white/50">
          How It Works
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
          Rent a bike in just a few simple steps
        </h2>
        <p className="mt-6 text-lg text-white/60">
          A fast, optimized process helps you save time.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {howItWorks.map((item, index) => (
          <motion.div key={`step-${index}`} variants={stepVariants}>
            <Card step={item.step} title={item.title} desc={item.desc} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
