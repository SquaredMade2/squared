import type React from "react";
import {
  effortEstimateOptions,
  complexityScale,
} from "@/constants/designations";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { motion, AnimatePresence } from "framer-motion";
import { high, medium, low } from "@/components/Svg";
import type { EffortModalProps } from "./EffortModal.interfaces";
import ProgressBar from "@/components/ProgressBar";
import { X } from "lucide-react";

const EffortModal: React.FC<EffortModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <ClickAwayListener onClickAway={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center min-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border border-border bg-popover p-4 rounded-lg max-w-2xl w-full space-y-4 shadow-[#00000080] shadow-[0px_16px_70px]">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-foreground font-bold">
                    Effort Estimate Options
                  </h2>
                  <button
                    type="button"
                    className="hover:bg-accent rounded"
                    onClick={onClose}
                    title="Title"
                  >
                    <span className="w-4 h-4 cursor-pointer">
                      <X className="size-5 cursor-pointer" />
                    </span>
                  </button>
                </div>
                {effortEstimateOptions.map((effortEstimate, index) => {
                  const estimateNumber = Number.parseInt(
                    effortEstimate.substring(0, 2).trim(),
                    10
                  );
                  const effortEstimateKey = index;
                  return (
                    <div
                      className="flex justify-between space-x-14 w-full"
                      key={effortEstimateKey}
                    >
                      <div className="flex flex-row items-center">
                        <span className={`${"w-4 h-4 cursor-pointer"} mr-2`}>
                          {estimateNumber > 8
                            ? high()
                            : estimateNumber > 3
                              ? medium()
                              : low()}
                        </span>
                        <span className="text-foreground">
                          {effortEstimate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="text-muted-foreground mr-2">
                          {complexityScale[index]}
                        </div>
                        <div className="w-16">
                          <ProgressBar progress={estimateNumber} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </ClickAwayListener>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EffortModal;
