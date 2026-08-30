import React from 'react';
import '../styles/Button.css';

export default function Button({
  children,
  onClick,
  variant = 'primary', // primary | secondary | danger | ghost | outline
  size = 'md',        // sm | md | lg
  type = 'button',
  icon: Icon,
  disabled = false,
  className = '',
  title,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children && <span>{children}</span>}
    </button>
  );
}
