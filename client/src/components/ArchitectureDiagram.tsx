import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Globe, HardDrive, Zap, RefreshCw } from "lucide-react";

interface ArchitectureDiagramProps {
  title: string;
  description: string;
}

export default function ArchitectureDiagram({
  title,
  description,
}: ArchitectureDiagramProps) {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const layers = [
    {
      id: "presentation",
      name: "Presentation Layer",
      nameVi: "Lớp Trình bày",
      arrowClass: "text-primary",
      imageSrc: "/architecture/presentation-layer.svg",
      imageAlt: "Minh họa lớp trình bày — giao diện API và HTTP",
      components: ["API Controller", "HTTP Handler", "Request Validator"],
      description: "Xử lý HTTP requests và responses",
      gradient: "from-primary to-primary/70",
      glowColor: "group-hover:shadow-primary/30",
    },
    {
      id: "logic",
      name: "Logic Layer",
      nameVi: "Lớp Logic",
      arrowClass: "text-accent",
      imageSrc: "/architecture/logic-layer.svg",
      imageAlt: "Minh họa lớp logic — xử lý nghiệp vụ và luồng dữ liệu",
      components: ["Business Logic", "Auth Service", "API Service"],
      description: "Xử lý logic nghiệp vụ và quy tắc",
      gradient: "from-accent to-accent/70",
      glowColor: "group-hover:shadow-accent/30",
    },
    {
      id: "data",
      name: "Data Layer",
      nameVi: "Lớp Dữ liệu",
      arrowClass: "text-chart-3",
      imageSrc: "/architecture/data-layer.svg",
      imageAlt: "Minh họa lớp dữ liệu — cơ sở dữ liệu và lưu trữ",
      components: ["Database", "File Storage", "Cache"],
      description: "Quản lý lưu trữ và truy xuất dữ liệu",
      gradient: "from-chart-3 to-chart-3/70",
      glowColor: "group-hover:shadow-chart-3/30",
    },
  ];

  const dataFlow = [
    { icon: Globe, label: "Client Request" },
    { icon: RefreshCw, label: "Process" },
    { icon: HardDrive, label: "Store" },
    { icon: Zap, label: "Response" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const layerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="w-full py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-display text-foreground dark:text-zinc-50 mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground dark:text-zinc-300">
          {description}
        </p>
      </motion.div>

      {/* Architecture Layers */}
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {layers.map((layer, index) => {
          const isHovered = hoveredLayer === layer.id;

          return (
            <motion.div
              key={layer.id}
              variants={layerVariants}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              className="relative group"
            >
              {/* Connection Arrow */}
              {index < layers.length - 1 && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 z-10"
                  style={{ top: -20 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                >
                  <div className={`
                    w-10 h-10 rounded-full glass flex items-center justify-center
                    transition-all duration-300
                    ${isHovered ? "scale-110" : ""}
                  `}>
                    <ArrowDown className={`w-5 h-5 ${layer.arrowClass}`} />
                  </div>
                </motion.div>
              )}

              {/* Layer Card */}
              <motion.div
                className={`
                  relative p-6 md:p-8 rounded-3xl border border-border/50
                  dark:border-white/15 dark:bg-zinc-900/50
                  glass transition-all duration-300 cursor-pointer
                  hover:scale-[1.02] ${layer.glowColor}
                  ${isHovered ? "shadow-glow" : "shadow-card"}
                `}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Gradient Accent */}
                <div className={`
                  absolute inset-x-0 top-0 h-1 rounded-t-3xl
                  bg-gradient-to-r ${layer.gradient}
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `} />

                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Layer illustration */}
                  <motion.div
                    className={`
                      relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-2xl
                      border border-border/60 bg-card shadow-lg ring-1 ring-black/5
                      dark:ring-white/10
                      transition-transform duration-300
                      ${isHovered ? "rotate-2 scale-[1.06] shadow-xl" : ""}
                    `}
                  >
                    <img
                      src={layer.imageSrc}
                      alt={layer.imageAlt}
                      width={120}
                      height={120}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${layer.gradient} opacity-[0.12] mix-blend-multiply dark:opacity-[0.18] dark:mix-blend-soft-light`}
                      aria-hidden
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-heading text-foreground dark:text-zinc-50">
                        {layer.name}
                      </h3>
                      <span className="text-sm text-muted-foreground dark:text-zinc-400">
                        ({layer.nameVi})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-zinc-300 mb-4">
                      {layer.description}
                    </p>

                    {/* Components */}
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map((component, idx) => (
                        <motion.span
                          key={idx}
                          className={`
                            px-3 py-1.5 rounded-xl text-xs font-medium
                            bg-secondary/80 dark:bg-zinc-800/90 dark:text-zinc-100
                            backdrop-blur-sm
                            border border-border/50 dark:border-white/20
                            transition-all duration-200
                            ${isHovered ? "scale-105" : ""}
                          `}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          {component}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className={`w-2.5 h-2.5 rounded-full bg-green-500`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-xs text-muted-foreground dark:text-zinc-400">
                      Active
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Data Flow Visualization */}
      <motion.div
        className="mt-12 p-6 md:p-8 rounded-3xl glass shadow-card dark:border-white/15 dark:bg-zinc-900/50"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-lg font-heading text-foreground dark:text-zinc-50 mb-6 text-center">
          Luồng dữ liệu (Data Flow)
        </h3>
        
        <div className="flex items-center justify-between gap-4">
          {dataFlow.map((step, idx) => {
            const Icon = step.icon;
            const iconTone = [
              "text-primary dark:text-violet-300",
              "text-accent dark:text-fuchsia-300",
              "text-chart-3 dark:text-cyan-300",
              "text-amber-500 dark:text-amber-300",
            ][idx];
            return (
              <div key={idx} className="flex items-center gap-4">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 1 + idx * 0.15, type: "spring" }}
                >
                  <motion.div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl glass dark:bg-zinc-800/80 dark:border dark:border-white/15 flex items-center justify-center mb-2"
                    whileHover={{ scale: 1.1, y: -4 }}
                  >
                    <Icon
                      className={`w-6 h-6 md:w-7 md:h-7 ${iconTone}`}
                      strokeWidth={2.25}
                    />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium text-muted-foreground dark:text-zinc-200 text-center max-w-[5.5rem] md:max-w-none">
                    {step.label}
                  </span>
                </motion.div>

                {/* Arrow */}
                {idx < dataFlow.length - 1 && (
                  <motion.div
                    className="flex-1 hidden md:block"
                    initial={{ scaleX: 0 }}
                    animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 1.2 + idx * 0.15 }}
                  >
                    <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-chart-3 rounded-full" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
