import { motion } from "framer-motion";
import { Card, CardContent } from "@/app/components/ui/card";
import { CulturalFeature } from "../types";

interface FeatureGridProps {
  features: CulturalFeature[];
  columns?: 2 | 3 | 4;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 2,
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
    {features.map((feature, index) => (
      <motion.div
        key={feature.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4"
            >
              <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);
