import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

interface IProps {
  href?: string;
  inverse?: boolean;
  danger?: boolean;
  exact?: boolean;
  disabled?: boolean;

  to?: string;
  size?: string;
  type?:"button" | "submit" | "reset" | undefined;

  onClick?: () => void;

  children: JSX.Element | JSX.Element[] | string;
}

const Button = (props: IProps) => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        className={`button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${props.size || 'default'} ${props.inverse &&
        'button--inverse'} ${props.danger && 'button--danger'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
