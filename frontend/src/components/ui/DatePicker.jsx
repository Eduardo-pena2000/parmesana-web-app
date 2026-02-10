import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function DatePicker({ selectedDate, onChange }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    // Close calendar when clicking outside (simple implementation)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest('.datepicker-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = (e) => {
        // Prevent going back past current month if needed, but strictly for "visual" calendar allow it
        // Logic for disabling past dates handles the selection validity
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const onDateClick = (day) => {
        // Prevent selecting past dates
        if (isBefore(day, startOfDay(new Date()))) return;

        onChange(format(day, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    onClick={(e) => { e.preventDefault(); prevMonth(); }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </span>
                <button
                    onClick={(e) => { e.preventDefault(); nextMonth(); }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = "eeee";
        const days = [];
        let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Start week on Monday because... simple reasons (or 0 for Sunday)
        // Spanish locale uses Monday as start usually, verify locale options. 
        // Let's stick to standard grid.

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase py-1">
                    {format(addDays(startDate, i), 'eeeee', { locale: es })}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        const today = startOfDay(new Date());

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                const isSelected = selectedDate ? isSameDay(day, new Date(selectedDate + 'T00:00:00')) : false;
                const isToday = isSameDay(day, today);
                const isPast = isBefore(day, today);
                const isCurrentMonth = isSameMonth(day, monthStart);

                let cellClass = "relative h-10 w-10 flex items-center justify-center rounded-full text-sm transition-all duration-200 cursor-pointer ";

                if (!isCurrentMonth) {
                    cellClass += "text-gray-300 dark:text-gray-600 ";
                } else if (isPast) {
                    cellClass += "text-gray-400 dark:text-gray-600 cursor-not-allowed ";
                } else if (isSelected) {
                    cellClass += "bg-parmesana-green text-white shadow-lg shadow-parmesana-green/30 font-bold scale-110 ";
                } else if (isToday) {
                    cellClass += "text-parmesana-green font-bold border border-parmesana-green ";
                } else {
                    cellClass += "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ";
                }

                days.push(
                    <div
                        key={day}
                        className={`flex justify-center items-center p-1 ${!isCurrentMonth ? 'opacity-50' : ''}`}
                        onClick={(e) => { e.preventDefault(); !isPast && onDateClick(cloneDay); }}
                    >
                        <div className={cellClass}>
                            {formattedDate}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className="datepicker-container relative">
            {/* Toggle Button / Input Display */}
            <div
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-parmesana-green transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <CalendarIcon className="w-5 h-5 mr-3 text-parmesana-green" />
                    <span className={!selectedDate ? 'text-gray-500 dark:text-gray-400' : 'font-medium'}>
                        {selectedDate
                            ? format(new Date(selectedDate + 'T00:00:00'), "d 'de' MMMM, yyyy", { locale: es })
                            : 'Seleccionar fecha'}
                    </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* Dropdown Calendar */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-4 animate-scale-in">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            )}
        </div>
    );
}
