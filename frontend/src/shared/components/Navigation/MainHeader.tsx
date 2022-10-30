import React from 'react';

import './MainHeader.css';

interface IProps {
    children: JSX.Element[];
}

const MainHeader = (props: IProps) => {
  return (
    <header className='main-header'>
        {props.children}
    </header>
  )
}

export default MainHeader