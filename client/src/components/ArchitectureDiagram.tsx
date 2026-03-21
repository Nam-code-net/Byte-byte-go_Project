import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    setIsVisible(true);
  }, []);

  const layers = [
    {
      id: "presentation",
      name: "Presentation Layer",
      color: "from-blue-500 to-blue-600",
      icon: "🌐",
      components: ["API Controller", "HTTP Handler", "Request Validator"],
      description: "Handles HTTP requests and responses",
    },
    {
      id: "logic",
      name: "Logic Layer",
      color: "from-green-500 to-green-600",
      icon: "⚙️",
      components: ["Business Logic", "Auth Service", "API Service"],
      description: "Processes business rules and logic",
    },
    {
      id: "data",
      name: "Data Layer",
      color: "from-slate-600 to-slate-700",
      icon: "💾",
      components: ["Database", "File Storage", "Cache"],
      description: "Manages data persistence and retrieval",
    },
  ];

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

  const layerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-display font-bold text-foreground mb-3">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            variants={layerVariants}
            onMouseEnter={() => setHoveredLayer(layer.id)}
            onMouseLeave={() => setHoveredLayer(null)}
            className="relative"
          >
            {/* Connection Arrow */}
            {index < layers.length - 1 && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-current to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-3 border-l-transparent border-r-transparent border-t-current" />
              </motion.div>
            )}

            {/* Layer Card */}
            <motion.div
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer
                ${
                  hoveredLayer === layer.id
                    ? `bg-gradient-to-r ${layer.color} text-white shadow-lg scale-105`
                    : `bg-gradient-to-r ${layer.color} text-white shadow-md`
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{layer.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{layer.name}</h3>
                    <p className="text-sm opacity-90">{layer.description}</p>
                  </div>
                </div>
              </div>

              {/* Components Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={hoveredLayer === layer.id ? { opacity: 1 } : { opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {layer.components.map((component, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 text-sm font-medium text-center"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  >
                    {component}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Data Flow Visualization */}
      <motion.div
        className="mt-12 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Data Flow</h3>
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
              1
            </div>
            <span>Request</span>
          </div>
          <motion.div
            className="flex-1 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-slate-600 mx-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs">
              2
            </div>
            <span>Process</span>
          </div>
          <motion.div
            className="flex-1 h-1 bg-gradient-to-r from-slate-600 via-green-500 to-blue-500 mx-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              3
            </div>
            <span>Response</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
