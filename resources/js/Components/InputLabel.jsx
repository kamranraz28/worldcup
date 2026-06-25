export default function InputLabel({ value, className = '', children }) {
    return (
        <label className={`block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5 ${className}`}>
            {value || children}
        </label>
    );
}
