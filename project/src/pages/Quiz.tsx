import React from 'react';
import { motion } from 'framer-motion';
import QuizModule from '../components/QuizModule';

const Quiz = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            E-Waste <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Knowledge Quiz</span>
          </h1>
          <p className="text-lg text-gray-600">
            Test your knowledge and earn badges while learning about responsible e-waste management
          </p>
        </motion.div>

        <QuizModule />
      </div>
    </div>
  );
};

export default Quiz;