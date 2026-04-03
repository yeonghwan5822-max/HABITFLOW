import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon, IconName } from '../atoms/Icon';
import { DisciplineRank } from '../../hooks/useIntegrityScore';
import { playSystemSound } from '../../lib/audioUtils';

interface RankUpModalProps {
  rank: DisciplineRank | null;
  isVisible: boolean;
  onClose: () => void;
}

export function RankUpModal({ rank, isVisible, onClose }: RankUpModalProps) {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible) {
      playSystemSound();
      
      // Auto close after 4.5 seconds for convenience
      timeout = setTimeout(onClose, 4500);
    }
    return () => clearTimeout(timeout);
  }, [isVisible, onClose]);

  const getRankDetails = (r: DisciplineRank | null): { icon: IconName; color: string; bg: string } => {
    switch (r) {
      case 'Master of Discipline': return { icon: 'Diamond', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' };
      case 'Senior Warden': return { icon: 'ShieldCheck', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20' };
      case 'Officer': return { icon: 'Scale', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' };
      case 'Cadet': 
      default: return { icon: 'Shield', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-200 dark:bg-gray-800' };
    }
  };

  const { icon, color, bg } = getRankDetails(rank);

  return (
    <AnimatePresence>
      {isVisible && rank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center relative"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ring-white dark:ring-zinc-900 shadow-sm ${bg}`}>
              <Icon name={icon} size={40} className={color} />
            </div>
            
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-[0.2em] uppercase mb-2">Rank Promoted</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{rank}</h2>
            
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-8">
              새로운 권한과 지위가 승인되었습니다.<br/>최상의 규율을 유지하십시오.
            </p>
            
            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold transition-colors"
            >
              System Confirm
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
