import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLang = LANGUAGES.find((l) => l.code === language);

    return (
        <div ref={containerRef} className="fixed bottom-24 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-16 right-0 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden mb-2"
                    >
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Select Language
                            </p>
                        </div>
                        <div className="py-1 max-h-72 overflow-y-auto">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors ${language === lang.code ? "bg-orange-50/80" : ""
                                        }`}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm font-medium ${language === lang.code
                                                    ? "text-orange-700"
                                                    : "text-gray-800"
                                                }`}
                                        >
                                            {lang.nativeName}
                                        </p>
                                        <p className="text-[10px] text-gray-400">{lang.name}</p>
                                    </div>
                                    {language === lang.code && (
                                        <Check className="w-4 h-4 text-orange-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all ${isOpen
                        ? "bg-orange-600 text-white"
                        : "bg-white/90 backdrop-blur-xl border border-gray-200/60 text-gray-700 hover:bg-orange-50"
                    }`}
            >
                <div className="flex flex-col items-center">
                    <Globe className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5 uppercase">
                        {currentLang?.code}
                    </span>
                </div>
            </motion.button>
        </div>
    );
};

export default LanguageSelector;
