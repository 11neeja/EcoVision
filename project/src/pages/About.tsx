import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Globe, Lightbulb, Recycle, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '10M+', label: 'Items Classified', icon: <Recycle className="w-6 h-6" /> },
    { number: '50K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { number: '95%', label: 'Accuracy Rate', icon: <Target className="w-6 h-6" /> },
    { number: '25', label: 'Countries', icon: <Globe className="w-6 h-6" /> },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safety First',
      description: 'We prioritize user safety by identifying hazardous materials and providing proper handling instructions.',
      color: 'coral'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'Environmental Impact',
      description: 'Every classification contributes to reducing electronic waste and promoting sustainable practices.',
      color: 'eco'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Cutting-edge AI and machine learning technologies make e-waste management accessible to everyone.',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">EcoVision</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              EcoVision is revolutionizing how we handle electronic waste through AI-powered classification 
              and environmental impact tracking. Our mission is to make responsible e-waste management 
              accessible, accurate, and rewarding for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-eco-100 to-purple-100 text-eco-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Electronic waste is one of the fastest-growing waste streams globally, with millions 
                of tons generated annually. Many people don't know how to properly identify or dispose 
                of their electronic devices, leading to environmental harm and safety risks.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                EcoVision bridges this knowledge gap by providing instant, accurate classification 
                of e-waste items, identifying hazardous materials, and offering personalized 
                disposal recommendations.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-eco-500 to-purple-500 text-white rounded-full font-semibold">
                Making E-Waste Management Simple
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-eco-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/30 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full"></div>
                <div className="relative z-10">
                  <Recycle className="w-16 h-16 text-eco-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">54 Million Tons</h3>
                  <p className="text-gray-700">
                    Of electronic waste generated globally each year. Help us reduce this number 
                    through better classification and disposal practices.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              The principles that guide everything we do
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-${value.color}-100 to-${value.color}-200 text-${value.color}-600 mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our classification system uses state-of-the-art Convolutional Neural Networks (CNN) 
              for image recognition combined with Support Vector Machine (SVM) and Random Forest 
              algorithms for accurate categorization and hazard detection.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-gradient-to-r from-eco-50 to-eco-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-eco-800 mb-2">Image Recognition</h3>
                <p className="text-eco-700">
                  CNN models trained on thousands of e-waste images for precise identification
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Hazard Detection</h3>
                <p className="text-purple-700">
                  ML algorithms identify dangerous materials like mercury, lead, and lithium
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;