import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[inherit]">
            <div className={`${sizeClasses[size] || sizeClasses.md} border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}></div>
        </div>
    );
};

export default LoadingSpinner;
