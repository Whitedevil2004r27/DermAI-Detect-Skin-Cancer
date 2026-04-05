"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Calendar, ChevronRight, Clock } from "lucide-react";
import { HistoryEntry } from "@/hooks/useHistory";
import { format } from "date-fns";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[60] h-full w-full max-w-sm border-l border-border-subtle bg-bg-card shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-subtle p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">
                    Patient History
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-text-muted hover:bg-bg-hover hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {history.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                    <div className="rounded-2xl bg-bg-secondary p-6">
                       <Clock className="h-8 w-8 text-text-muted opacity-20" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      No recent analyses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((entry) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative flex cursor-pointer items-center space-x-4 rounded-2xl border border-border-subtle bg-bg-secondary/50 p-4 transition-all hover:bg-bg-hover"
                        onClick={() => onSelect(entry)}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                          <img
                            src={entry.image}
                            alt="Scan"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                entry.prediction.risk_level === 'CRITICAL' ? 'text-accent-red' : 
                                entry.prediction.risk_level === 'HIGH' ? 'text-accent-orange' : 'text-accent-green'
                            }`}>
                              {entry.prediction.risk_level}
                            </span>
                            <span className="text-[8px] font-mono text-text-muted">
                              {entry.id}
                            </span>
                          </div>
                          <h4 className="truncate text-[11px] font-bold text-white">
                            {entry.prediction.class_label}
                          </h4>
                          <div className="mt-1 flex items-center space-x-2 text-[9px] text-text-muted">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(entry.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-accent-red transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {history.length > 0 && (
                <div className="border-t border-border-subtle p-6">
                  <button
                    onClick={onClear}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl border border-border-subtle p-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-bg-secondary hover:text-accent-red transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All History</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
