"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RocketIcon, X } from "lucide-react";

interface ComingSoonAlertProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function ComingSoonAlert({
  isOpen,
  onClose,
  feature,
}: ComingSoonAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[380px] rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <RocketIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {feature}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coming soon! Stay tuned for updates.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-orange-500 rounded-full"
                  />
                  <button
                    onClick={onClose}
                    className="group p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-b-lg transition-colors duration-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
