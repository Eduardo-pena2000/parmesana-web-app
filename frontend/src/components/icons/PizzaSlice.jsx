export const PizzaSlice = ({ className = "w-6 h-6" }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Crust/Dough base */}
        <path
            d="M5 25 Q 50 -15 95 25 L 50 95 Z"
            fill="#dda657"
            stroke="#c28e43"
            strokeWidth="3"
        />

        {/* Cheese layer */}
        <path
            d="M10 28 Q 50 -5 90 28 L 50 90 Z"
            fill="#facc15"
        />

        {/* Pepperonis */}
        <circle cx="35" cy="40" r="7" fill="#ef4444" opacity="0.9" />
        <circle cx="65" cy="40" r="7" fill="#ef4444" opacity="0.9" />
        <circle cx="50" cy="65" r="6" fill="#ef4444" opacity="0.9" />
        <circle cx="50" cy="35" r="5" fill="#ef4444" opacity="0.8" />

        {/* Green Peppers (small details) */}
        <path d="M40 50 L 45 50" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
        <path d="M55 55 L 60 55" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
    </svg>
);
