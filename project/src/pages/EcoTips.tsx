import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Lightbulb, Recycle, Shield, MapPin, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EcoTips = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);

  const categories = [
    { id: 'all', name: 'All Tips', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'batteries', name: 'Batteries', icon: <Shield className="w-4 h-4" /> },
    { id: 'devices', name: 'Devices', icon: <Phone className="w-4 h-4" /> },
    { id: 'disposal', name: 'Disposal', icon: <Recycle className="w-4 h-4" /> },
    { id: 'locations', name: 'Locations', icon: <MapPin className="w-4 h-4" /> }
  ];

  const tips = [
    {
      id: 1,
      category: 'batteries',
      title: 'Lithium Battery Safety',
      content: 'Never puncture or expose lithium batteries to heat. Store in cool, dry places and dispose at certified recycling centers.',
      icon: <Shield className="w-6 h-6" />,
      color: 'coral'
    },
    {
      id: 2,
      category: 'devices',
      title: 'Smartphone Recycling',
      content: 'Before recycling your phone, perform a factory reset, remove the SIM card, and check manufacturer take-back programs.',
      icon: <Phone className="w-6 h-6" />,
      color: 'eco'
    },
    {
      id: 3,
      category: 'disposal',
      title: 'Mercury-Containing Devices',
      content: 'Old thermostats and fluorescent bulbs contain mercury. Take them to hazardous waste collection facilities.',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 4,
      category: 'locations',
      title: 'Find Recycling Centers',
      content: 'Use online databases like Earth911 or Call2Recycle to find certified e-waste recycling locations near you.',
      icon: <MapPin className="w-6 h-6" />,
      color: 'primary'
    },
    {
      id: 5,
      category: 'devices',
      title: 'Computer Hard Drive Security',
      content: 'Before disposing of computers, use data destruction software or physically destroy hard drives to protect personal data.',
      icon: <Shield className="w-6 h-6" />,
      color: 'coral'
    },
    {
      id: 6,
      category: 'batteries',
      title: 'Car Battery Disposal',
      content: 'Car batteries contain lead and acid. Return them to auto parts stores or battery retailers for proper recycling.',
      icon: <Recycle className="w-6 h-6" />,
      color: 'eco'
    }
  ];

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone')) {
        botResponse = 'For smartphones: 1) Factory reset your device 2) Remove SIM card 3) Check with manufacturer for take-back programs 4) Use certified e-waste recyclers. Never throw phones in regular trash!';
      } else if (lowerMessage.includes('battery') || lowerMessage.includes('lithium')) {
        botResponse = 'Batteries contain hazardous materials like lithium and should never go in regular trash. Find battery drop-off locations at retailers like Best Buy, Home Depot, or use the Call2Recycle locator.';
      } else if (lowerMessage.includes('recycle') || lowerMessage.includes('dispose')) {
        botResponse = 'For safe e-waste disposal: 1) Find certified recyclers using Earth911.com 2) Check manufacturer take-back programs 3) Never put e-waste in regular trash 4) Remove personal data first. Need help finding locations?';
      } else {
        botResponse = 'I can help with e-waste disposal questions! Ask me about specific devices like phones, computers, batteries, or where to find recycling centers near you.';
      }
      
      setChatHistory(prev => [...prev, { type: 'bot', message: botResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Eco <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">Tips</span>
          </h1>
          <p className="text-lg text-gray-600">
            Learn how to safely handle and dispose of electronic waste
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tips Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tips Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${tip.color}-100 text-${tip.color}-600 mb-4`}>
                    {tip.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                </motion.div>
              ))}
            </div>

            {filteredTips.length === 0 && (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
                <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>

          {/* Chatbot Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 h-fit"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-eco-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ask EcoBot</h2>
            </div>
            
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {chatHistory.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Hi! I'm here to help with e-waste questions. Ask me about recycling specific devices, disposal locations, or safety tips!
                </div>
              )}
              
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-100 text-purple-900 ml-4'
                      : 'bg-gray-100 text-gray-900 mr-4'
                  }`}
                >
                  <div className="text-sm">{message.message}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about e-waste disposal..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EcoTips;