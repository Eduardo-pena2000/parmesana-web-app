import { Clock } from 'lucide-react';

export default function TimePicker({ selectedTime, onChange }) {
    // Generate time slots from 1:00 PM (13:00) to 10:00 PM (22:00)
    const timeSlots = [];
    for (let i = 13; i <= 22; i++) {
        timeSlots.push(`${i}:00`);
        if (i !== 22) timeSlots.push(`${i}:30`);
    }

    return (
        <div className="space-y-3">
            {/* Label-like header handled by parent, but we can add a visual cue if needed */}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;

                    return (
                        <button
                            key={time}
                            type="button"
                            onClick={() => onChange(time)}
                            className={`
                        relative px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        flex items-center justify-center gap-1
                        ${isSelected
                                    ? 'bg-parmesana-green text-white shadow-lg shadow-parmesana-green/20 scale-105 ring-2 ring-parmesana-green ring-offset-2 ring-offset-white dark:ring-offset-parmesana-dark'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700'}
                    `}
                        >
                            {isSelected && <Clock className="w-3 h-3" />}
                            {time}
                        </button>
                    );
                })}
            </div>

            {/* Helper text */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Horarios disponibles de 1:00 PM a 10:00 PM
            </p>
        </div>
    );
}
