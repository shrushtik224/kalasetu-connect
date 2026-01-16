import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Circle, Square } from "lucide-react";
import artisanWorking from "@/assets/artisan-working.jpg";

const RecordingScreen = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 3) {
            // After 3 seconds, navigate to processing
            navigate("/artisan/processing");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera Viewfinder (Simulated) */}
      <div className="absolute inset-0">
        <img
          src={artisanWorking}
          alt="Camera view"
          className="w-full h-full object-cover"
        />
        {/* Camera overlay grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>
      </div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-white font-mono text-lg">{formatTime(timer)}</span>
            <span className="text-white/60 text-sm">/ 00:30</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button */}
      <button
        onClick={() => navigate("/artisan/dashboard")}
        className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Instructions */}
      <AnimatePresence>
        {!isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/4 left-0 right-0 text-center px-6"
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto">
              <p className="text-white text-lg mb-1">अपना सामान दिखाएं</p>
              <p className="text-white/70 text-sm">
                Hold your craft and describe it in your language
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRecording(!isRecording)}
          className="relative"
        >
          {/* Outer ring */}
          <div className={`w-20 h-20 rounded-full border-4 ${isRecording ? 'border-red-500' : 'border-white'} flex items-center justify-center transition-colors`}>
            {isRecording ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-red-500 rounded-md"
              >
                <Square className="w-full h-full text-red-500" fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Circle className="w-10 h-10 text-red-500" fill="currentColor" />
              </motion.div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-28 left-0 right-0 text-center">
        <p className="text-white/80 text-sm">
          {isRecording ? "टैप करके रुकें (Tap to stop)" : "टैप करके रिकॉर्ड करें (Tap to record)"}
        </p>
      </div>
    </div>
  );
};

export default RecordingScreen;
