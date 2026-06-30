import { motion } from "framer-motion";
import Card from "./Card";
import {
  Zap,
  Motorbike,
  MessageCircleQuestionMark,
  BanknoteArrowDown,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      id: "fast-booking",
      title: "Fast Booking",
      desc: "Find and book a bike in just a few minutes with our optimized and intuitive interface.",
      icon: <Zap className="w-10 h-10 text-white" />,
    },
    {
      id: "transparent-pricing",
      title: "Transparent Pricing",
      desc: "Full disclosure of costs with no hidden fees.",
      icon: <BanknoteArrowDown className="w-10 h-10 text-white" />,
    },
    {
      id: "diverse-selection",
      title: "Diverse Bike Selection",
      desc: "Wide range of options from standard to premium bikes to suit every need.",
      icon: <Motorbike className="w-10 h-10 text-white" />,
    },
    {
      id: "support-247",
      title: "24/7 Customer Support",
      desc: "Our support team is always ready to assist you throughout your bike rental experience.",
      icon: <MessageCircleQuestionMark className="w-10 h-10 text-white" />,
    },
  ];

  // Khung hiệu ứng Container bọc ngoài
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // Mỗi card con xuất hiện cách nhau 0.12 giây
      },
    },
  };

  // Hiệu ứng dịch chuyển của từng Card con
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
      },
    },
  } as const;

  return (
    <section id="features" className="space-y-16 scroll-mt-24">
      {/* Phần Text Header cũng được animate mượt mà */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center text-muted-foreground"
      >
        <p className="uppercase tracking-[0.3em] mb-4 text-sm text-white/50">
          Why Choose Us
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight capitalize">
          fast, transparent, and modern
        </h2>
        <p className="mt-6 text-lg text-white/60">
          We provide a convenient, transparent, and optimized bike rental
          platform from search to booking.
        </p>
      </motion.div>

      {/* Grid danh sách card bọc bởi motion div */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {features.map((item) => (
          <motion.div key={item.id} variants={cardVariants}>
            <Card title={item.title} desc={item.desc} icon={item.icon} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
