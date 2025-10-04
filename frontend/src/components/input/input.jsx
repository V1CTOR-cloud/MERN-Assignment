import React from 'react';
import './input.css';
import errorICON from '../../assets/icons/error.png';


const Input = ({ 
    label, 
    type, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required,
    error_title, 
    error_message 
}) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={name} className="input-label">{label}</label>}
            <input
                id={name}
                className="input-field"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
            {(error_title || error_message) && (
                <div className="error">
                    <img src={errorICON} alt="" className='error-ico' />
                    {error_title && <span className="error-title">{error_title}:</span>}
                    {error_message && <p className='error-message'>{error_message}</p>}
                </div>
            )}
        </div>
    );
};

export default Input;
