import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ArrowRight, 
  Play,
  Code2,
  Layers,
  Database,
  Zap
} from "lucide-react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20, 
        y: (e.clientY / window.innerHeight - 0.5) * 20 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const features = [
    { icon: <Layers className="w-5 h-5" />, label: "3-Tier Architecture" },
    { icon: <Database className="w-5 h-5" />, label: "EF Core & Dapper" },
    { icon: <Code2 className="w-5 h-5" />, label: "DTO & AutoMapper" },
    { icon: <Zap className="w-5 h-5" />, label: "Performance" },
  ];

  return (
    <motion.div
      className="relative min-h-[600px] md:min-h-[700px] overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px]"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: "tween", duration: 0.5 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[100px]"
        animate={{
          x: -mousePosition.x * 1.5,
          y: -mousePosition.y * 1.5,
        }}
        transition={{ type: "tween", duration: 0.5 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-chart-3/15 blur-[80px]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "tween", duration: 0.5 }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <Badge 
            className="px-5 py-2.5 text-sm font-semibold rounded-full
                       glass shadow-glow hover:scale-105 transition-transform cursor-default"
          >
            <Sparkles className="w-4 h-4 mr-2 text-accent animate-pulse" />
            System Design Masterclass 2024
          </Badge>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.1]"
        >
          <span className="text-zinc-900 dark:text-zinc-50">Xây dựng</span>
          <br />
          <span className="gradient-text">System Design</span>
          <br />
          <span className="text-zinc-700 dark:text-zinc-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Chuyên nghiệp
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Học cách thiết kế hệ thống scalable, reliable và maintainable
          từ những chuyên gia hàng đầu trong ngành
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="h-14 px-8 rounded-2xl gradient-primary text-white font-bold text-base
                         shadow-glow hover:shadow-xl transition-all duration-300
                         flex items-center gap-2"
              onClick={() => {
                const el = document.getElementById("chapter-content");
                if (!el) return;
                const rect = el.getBoundingClientRect();
                window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: "smooth" });
              }}
            >
              <Play className="w-5 h-5" />
              Bắt đầu học ngay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-2xl font-bold text-base
                         glass border-2 hover:bg-accent/5 transition-all duration-300"
              onClick={() => {
                const el = document.getElementById("course-sidebar");
                if (!el) return;
                const rect = el.getBoundingClientRect();
                window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: "smooth" });
              }}
            >
              Xem chương trình
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass
                         text-sm font-medium text-foreground/80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-primary">{feature.icon}</span>
              {feature.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto"
          variants={itemVariants}
        >
          {[
            { value: "10+", label: "Chapters", delay: 0 },
            { value: "50+", label: "Concepts", delay: 0.1 },
            { value: "100+", label: "Diagrams", delay: 0.2 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-4 rounded-2xl glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + stat.delay, type: "spring" }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-display gradient-text"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + stat.delay, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0, 1], y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
