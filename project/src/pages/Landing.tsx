import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Recycle, Shield, BarChart3, Award, Sparkles, Leaf, Globe, Zap, Users, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Lottie from 'lottie-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true });

  const features = [
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "AI-Powered Classification",
      description: "Advanced CNN and ML models identify e-waste types and hazardous materials instantly with 95% accuracy",
      color: "eco",
      gradient: "from-eco-400 to-eco-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety Assessment",
      description: "Detect dangerous components like mercury, lithium, and lead with comprehensive safety recommendations",
      color: "coral",
      gradient: "from-coral-400 to-coral-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Impact Tracking",
      description: "Monitor your environmental impact with detailed analytics, progress tracking, and real-time insights",
      color: "purple",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Achievement System",
      description: "Earn badges and rewards for responsible e-waste classification behavior and environmental contributions",
      color: "teal",
      gradient: "from-teal-400 to-teal-600"
    }
  ];

  const stats = [
    { number: '50K+', label: 'Items Classified', icon: <Recycle className="w-6 h-6" />, color: 'eco' },
    { number: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6" />, color: 'purple' },
    { number: '95%', label: 'Accuracy Rate', icon: <Target className="w-6 h-6" />, color: 'coral' },
    { number: '25+', label: 'Countries', icon: <Globe className="w-6 h-6" />, color: 'teal' },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Scientist",
      content: "EcoVision has revolutionized how we handle e-waste in our lab. The AI classification is incredibly accurate!",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Mike Chen",
      role: "IT Manager",
      content: "The safety assessments have prevented several hazardous material incidents. This platform is essential for any organization.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Emma Davis",
      role: "Sustainability Coordinator",
      content: "The gamification aspect makes e-waste management engaging for our entire team. We've seen a 300% increase in proper disposal.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  // Mock Lottie animation data (replace with actual Lottie files)
  const earthAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 400,
    h: 400,
    nm: "Earth",
    ddd: 0,
    assets: [],
    layers: []
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-eco-25 via-purple-25 to-teal-25">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-eco-400 to-eco-600 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full opacity-20 blur-xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-eco-200/50 mb-8 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-eco-500 mr-2 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-eco-600 to-teal-600 bg-clip-text text-transparent">
                AI-Powered E-Waste Solution
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-eco-600 via-teal-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                EcoVision
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-gray-800 dark:text-gray-200 text-4xl md:text-5xl lg:text-6xl"
              >
                One Click to Save Earth
              </motion.span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform the way you handle electronic waste with AI-powered classification, 
              real-time safety assessment, and comprehensive environmental impact tracking.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              to={isAuthenticated ? "/classify" : "/signup"}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-eco-600 hover:via-teal-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-eco-lg transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Start Classifying Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border border-gray-200/50 hover:bg-white hover:border-eco-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.description.split(' ').slice(0, 6).join(' ')}...
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-eco-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-eco-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Making a <span className="bg-gradient-to-r from-eco-600 to-teal-600 bg-clip-text text-transparent">Global Impact</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of users worldwide in the fight against electronic waste
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 text-${stat.color}-600 mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isStatsInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1, type: "spring" }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">EcoVision?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced AI technology meets environmental responsibility in the most comprehensive e-waste platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-eco-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r ${feature.gradient} rounded-full`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-eco-50 via-purple-50 to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by <span className="bg-gradient-to-r from-eco-600 to-teal-600 bg-clip-text text-transparent">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users are saying about EcoVision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex text-eco-500 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full"
        />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are making responsible e-waste decisions and contributing to a sustainable future
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={isAuthenticated ? "/classify" : "/signup"}
                className="group inline-flex items-center px-8 py-4 bg-white text-eco-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Instant Results</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;