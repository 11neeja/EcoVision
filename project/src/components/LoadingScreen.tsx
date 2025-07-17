import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-eco-50 via-purple-50 to-teal-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-eco-500 to-teal-500 rounded-full flex items-center justify-center mx-auto relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Recycle className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Orbiting elements */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Leaf className="w-4 h-4 text-eco-600" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Leaf className="w-4 h-4 text-teal-600" />
              </div>
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <Leaf className="w-4 h-4 text-purple-600" />
              </div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <Leaf className="w-4 h-4 text-coral-600" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-600 to-teal-600 bg-clip-text text-transparent mb-4">
            EcoVision
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            One Click to Save Earth
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-eco-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-teal-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;