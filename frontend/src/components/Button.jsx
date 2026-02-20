import React from 'react';

const Button = ({
    children,
    onClick,
    disabled = false,
    type = 'button',
    variant = 'primary',
    className = '',
    ...rest
}) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
        outline: 'border border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
