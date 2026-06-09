import { motion } from "framer-motion";

interface MovingEmojiProps {
  emoji: string;
  gradientClassName: string;
  duration?: number;
}

export default function MovingEmoji({
  emoji,
  gradientClassName,
  duration = 4,
}: MovingEmojiProps) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "220px" }}
      transition={{ delay: 0.5, duration: 1 }}
      className={`relative mt-10 h-[2px] ${gradientClassName}`}
    >
      <motion.div
        animate={{ x: [0, 180, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-4 text-xl"
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
}
