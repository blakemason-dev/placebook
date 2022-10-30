import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

interface IProps {
    onClick?: () => void;
}

const Backdrop = (props: IProps) => {
  return ReactDOM.createPortal(
    <div className='backdrop' onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook') as Element | DocumentFragment
  )
}

export default Backdrop