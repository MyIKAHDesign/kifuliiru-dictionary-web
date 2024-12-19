import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedStatIconProps {
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function AnimatedStatIcon({
  Icon,
  color,
  bgColor,
}: AnimatedStatIconProps) {
  return (
    <motion.div
      className={`p-3 rounded-lg ${bgColor}`}
      whileHover={{ scale: 1.2, rotate: 360 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.7,
      }}
    >
      <Icon className={`w-6 h-6 ${color}`} />
    </motion.div>
  );
}
