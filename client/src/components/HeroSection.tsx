import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  backgroundImage?: string;
}

export default function HeroSection({
  backgroundImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663161807068/VXk9pdyGTXCXCBgErm8ZEv/hero-banner-KCR55HtoWgUwVv5ZFPdsvS.webp",
}: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="relative h-[560px] sm:h-[620px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundAttachment: "scroll",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-slate-900/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      />

      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.16) 0%, transparent 44%)`,
        }}
        transition={{ type: "tween", duration: 0.2 }}
      />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center text-white z-10 px-4 w-full max-w-5xl">
          <motion.div variants={itemVariants} className="mb-4">
            <Badge className="px-4 py-2 text-sm font-semibold border border-white/25 bg-white/15 backdrop-blur-md text-white rounded-full">
              ByteByteGo Style - System Design Masterclass
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-4 leading-tight"
          >
            Master System
            <motion.span
              className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-white bg-clip-text text-transparent"
              initial={{ backgroundPosition: "0% center" }}
              animate={{ backgroundPosition: "100% center" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Design
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-2xl text-blue-100/95 mb-8 max-w-2xl mx-auto"
          >
            Learn how to design scalable, reliable, and maintainable systems like the experts
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="px-8 bg-white text-blue-700 hover:bg-blue-50 font-bold"
                onClick={() =>
                  document
                    .getElementById("chapter-content")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Learning
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-white/10 text-white border-white/35 hover:bg-white/20"
                onClick={() =>
                  document
                    .getElementById("course-sidebar")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                View Curriculum
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 sm:mt-12 max-w-md mx-auto"
            variants={containerVariants}
          >
            {[
              { label: "Chapters", value: "10+" },
              { label: "Concepts", value: "50+" },
              { label: "Diagrams", value: "100+" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
