import React from 'react';
import './button.css';

const Button = ({ 
    children, 
    type, 
    onClick, 
    disabled, 
    variant,
    fullWidth 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
        >
            {children}
        </button>
    );
};

export default Button;