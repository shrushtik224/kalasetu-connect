import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProcessingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/artisan/review");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center px-4">
      {/* Spinning Pot Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Outer glow */}
        <div className="absolute inset-0 -m-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
        
        {/* Spinning container */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="relative w-32 h-32 flex items-center justify-center"
        >
          {/* Pot SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 text-primary"
            fill="currentColor"
          >
            {/* Pot body */}
            <ellipse cx="50" cy="75" rx="35" ry="15" opacity="0.3" />
            <path
              d="M20 40 Q20 75 50 80 Q80 75 80 40 L75 35 Q75 30 50 25 Q25 30 25 35 Z"
              fill="currentColor"
            />
            {/* Pot rim */}
            <ellipse cx="50" cy="35" rx="28" ry="8" opacity="0.8" />
            {/* Decorative pattern */}
            <path
              d="M30 50 Q40 55 50 50 Q60 55 70 50"
              fill="none"
              stroke="hsl(var(--cream))"
              strokeWidth="2"
              opacity="0.6"
            />
            <path
              d="M32 60 Q42 65 52 60 Q62 65 68 60"
              fill="none"
              stroke="hsl(var(--cream))"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-accent rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: i * 0.3,
              ease: "linear",
            }}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: `${-40 + i * 10}px 0`,
            }}
          />
        ))}
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
          हमारी AI आपकी कहानी सुन रही है...
        </h2>
        <p className="text-muted-foreground">
          Our AI is listening to your story...
        </p>
      </motion.div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Processing steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 space-y-3 text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-muted-foreground"
        >
          ✓ वीडियो प्राप्त हुआ (Video received)
        </motion.p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          ⟳ भाषा समझ रहे हैं (Understanding language)
        </motion.p>
        <motion.p
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="text-sm text-muted-foreground/60"
        >
          ○ कीमत तय कर रहे हैं (Calculating price)
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ProcessingScreen;
