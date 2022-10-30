import React from 'react';

import './Card.css';

interface IProps {
  className?: string;
  style?: React.CSSProperties | undefined;
  children: JSX.Element | JSX.Element[];
}


const Card = (props: IProps) => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
