import React from 'react';
import type { CSSProperties } from 'react';
import type { ProgressBarProps } from './ProgressBar.interfaces';

const ProgressBar = ({
  progress,
  color = 'rgba(var(--bg-newIssue), 1)',
  secondaryColor = 'rgba(var(--bg-accent), 1)',
  height = 10,
}: ProgressBarProps) => {
  const adjustedFibonacciWidth = Math.max((progress + 1) * 4, 1);

  const Parentdiv: CSSProperties = {
    width: '100%',
    height: height,
    backgroundColor: secondaryColor,
    borderRadius: 30,
  };

  const Childdiv: CSSProperties = {
    width: `${adjustedFibonacciWidth}%`,
    height: height,
    backgroundColor: color,
    borderRadius: progress > 0 ? '30px 0 0 30px' : '30px',
    textAlign: 'right',
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span>&#8203;</span>
      </div>
    </div>
  );
};

export default ProgressBar;
