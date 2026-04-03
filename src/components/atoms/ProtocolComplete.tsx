import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProtocolCompleteProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function ProtocolComplete({ isVisible, onComplete }: ProtocolCompleteProps) {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible && onComplete) {
      // Auto-hide the overlay after 2.5 seconds
      timeout = setTimeout(onComplete, 2500);
    }
    return () => clearTimeout(timeout);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, letterSpacing: '0.1em' }}
            animate={{ scale: 1, opacity: 1, letterSpacing: '0.4em' }}
            exit={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-white font-black text-3xl md:text-5xl text-center uppercase tracking-widest drop-shadow-2xl"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Protocol Complete
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
