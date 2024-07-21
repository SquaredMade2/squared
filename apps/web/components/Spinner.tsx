import type { FC } from 'react';

interface SpinnerProps {
  size?: string;
}

const Spinner: FC<SpinnerProps> = ({ size = '40px' }) => {
  const spinnerSize = size;

  const spinnerStyle: React.CSSProperties = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: spinnerSize,
    height: spinnerSize,
    animation: 'spin 1s linear infinite',
    position: 'absolute',
    top: '25%',
    left: '50%',
    zIndex: 11,
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
    </>
  );
};

export default Spinner;
