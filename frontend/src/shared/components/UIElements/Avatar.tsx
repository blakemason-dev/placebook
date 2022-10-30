import React from 'react';

import './Avatar.css';

interface IProps {
  className?: string;
  style?: React.CSSProperties | undefined;
  width?: string;
  height?: string;

  image: string;
  alt: string;
}

const Avatar = (props: IProps) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
