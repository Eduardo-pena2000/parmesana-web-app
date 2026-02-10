import { Phone } from 'lucide-react';

export default function FloatingWhatsApp() {
    return (
        <a
            href="https://wa.me/528281005914"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 animate-bounce-slow flex items-center justify-center group"
            aria-label="Contactar por WhatsApp"
        >
            <Phone className="w-8 h-8 fill-current" />
            <span className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¡Pide por WhatsApp!
            </span>
        </a>
    );
}
