import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

interface IModalOverlayProps {
    className?: string;
    style?: CSSProperties;

    headerClass?: string;
    header?: string;

    onSubmit?: () => void;
    contentClass?: string;
    children?: JSX.Element | JSX.Element[];
    footerClass?: string;
    footer?: JSX.Element;
}

const ModalOverlay = (props: IModalOverlayProps) => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={
                props.onSubmit ? props.onSubmit : e => e.preventDefault()
                }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    )
    return ReactDOM.createPortal(content, document.getElementById('modal-hook') as Element | DocumentFragment);
}

interface IModalProps extends IModalOverlayProps {
    show?: boolean;
    onCancel?: () => void;
}

const Modal = (props: IModalProps) => {
    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition 
                in={props.show} 
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames='modal'
            >
                <ModalOverlay {...props} />
            </CSSTransition>
        </>
    )
}

export default Modal