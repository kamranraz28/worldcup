import { forwardRef } from 'react';

const TextInput = forwardRef(({ type = 'text', className = '', isFocused = false, ...props }, ref) => {
    return (
        <input
            {...props}
            type={type}
            className={`input-field ${className}`}
            ref={ref}
        />
    );
});

export default TextInput;
