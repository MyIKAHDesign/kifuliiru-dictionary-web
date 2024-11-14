import { motion } from "framer-motion";
import { TimelineEvent } from "../types";

interface TimelineSectionProps {
  events: TimelineEvent[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ events }) => (
  <div className="relative">
    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-gray-800" />
    <div className="space-y-8">
      {events.map((event, index) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative pl-10"
        >
          <div className="absolute left-0 top-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full border-2 border-indigo-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full" />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {event.year}
            </div>
            <div className="text-lg font-semibold mt-1">{event.event}</div>
            {event.description && (
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {event.description}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
