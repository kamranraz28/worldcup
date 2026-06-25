export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`btn-primary h-10 px-5 text-sm ${className}`}
        >
            {children}
        </button>
    );
}
