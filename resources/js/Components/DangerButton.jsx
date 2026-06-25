export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`btn-danger h-10 px-5 text-sm ${className}`}
        >
            {children}
        </button>
    );
}
