import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

interface IProps {
    children: JSX.Element[] | JSX.Element;
    show: boolean;
    onClick: () => void;
}

const SideDrawer = (props: IProps) => {
    const content = (
        <CSSTransition 
            in={props.show} 
            timeout={200} 
            classNames="slide-in-left"
            mountOnEnter
            unmountOnExit
        >
            <aside className="side-drawer" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    )

    return ReactDOM.createPortal(content, document.getElementById("drawer-hook") as Element | DocumentFragment);
}

export default SideDrawer