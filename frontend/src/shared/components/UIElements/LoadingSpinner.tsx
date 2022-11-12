import React from 'react';

import './LoadingSpinner.css';

interface iLoadingSpinnerProps {
  asOverlay?: boolean;
}

const LoadingSpinner = (props: iLoadingSpinnerProps) => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default LoadingSpinner;