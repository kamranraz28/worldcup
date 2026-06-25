export default function InputError({ message, className = '' }) {
    return message ? (
        <p className={`mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 ${className}`} role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
        </p>
    ) : null;
}
