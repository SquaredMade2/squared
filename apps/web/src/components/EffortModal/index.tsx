import type React from 'react';
import { effortEstimateOptions, complexityScale } from '@/constants/designations';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteIcon, high, medium, low } from '@/components/Svg';
import type { EffortModalProps } from './EffortModal.interfaces';
import { styles } from './EffortModal.styles';
import ProgressBar from '@/components/ProgressBar';

const EffortModal: React.FC<EffortModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalBackground}>
          <ClickAwayListener onClickAway={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.header}>Effort Estimate Options</h2>
                  <button type="button" className={styles.button} onClick={onClose}>
                    <span className={styles.svg}>{deleteIcon()}</span>
                  </button>
                </div>
                {effortEstimateOptions.map((effortEstimate, index) => {
                  const estimateNumber = Number.parseInt(effortEstimate.substring(0, 2).trim(), 10);
                  const effortEstimateKey = index;
                  return (
                    <div className={styles.optionsContainer} key={effortEstimateKey}>
                      <div className={styles.leftContainer}>
                        <span className={`${styles.svg} mr-2`}>
                          {estimateNumber > 8 ? high() : estimateNumber > 3 ? medium() : low()}
                        </span>
                        <span className={styles.text}>{effortEstimate}</span>
                      </div>
                      <div className={styles.rightContainer}>
                        <div className={styles.scale}>{complexityScale[index]}</div>
                        <div className={styles.bar}>
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
