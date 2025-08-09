import React, { memo } from 'react';

interface RotationControlsProps {
  readonly onRotateNext: () => void;
  readonly onRotatePrevious: () => void;
  readonly isRotating: boolean;
  readonly showControls: boolean;
}

const RotationControlsComponent: React.FC<RotationControlsProps> = ({
  onRotateNext,
  onRotatePrevious,
  isRotating,
  showControls,
}) => {
  if (!showControls) return null;

  const buttonStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#333333',
    border: '2px solid #f5f5f5',
    color: 'white',
    cursor: (isRotating ? 'not-allowed' : 'pointer'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isRotating ? 0.5 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <button
        onClick={onRotatePrevious}
        disabled={isRotating}
        style={buttonStyle}
        aria-label="Rotate previous"
      >
        ↑
      </button>
      <button
        onClick={onRotateNext}
        disabled={isRotating}
        style={buttonStyle}
        aria-label="Rotate next"
      >
        ↓
      </button>
    </div>
  );
};

export const RotationControls = memo(RotationControlsComponent);