export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={`btn-secondary h-10 px-5 text-sm ${className}`}
        >
            {children}
        </button>
    );
}
