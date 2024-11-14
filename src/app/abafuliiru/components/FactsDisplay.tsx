import { motion } from "framer-motion";
import { Card, CardContent } from "@/app/components/ui/card";
import { Fact } from "../types";

interface FactsDisplayProps {
  facts: Fact[];
}

export const FactsDisplay: React.FC<FactsDisplayProps> = ({ facts }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {facts.map((fact, index) => (
      <motion.div
        key={fact.label}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            {fact.icon && (
              <fact.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {fact.label}
            </div>
            <div className="text-lg font-semibold mt-1">{fact.value}</div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);
