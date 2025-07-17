import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m EcoBot, your AI assistant for e-waste questions. Ask me about recycling, disposal methods, or hazardous materials!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone') || lowerMessage.includes('mobile')) {
      return 'For smartphones: 1) Factory reset your device 2) Remove SIM card and memory cards 3) Check manufacturer take-back programs 4) Use certified e-waste recyclers. Never throw phones in regular trash as they contain lithium batteries and rare earth metals!';
    } else if (lowerMessage.includes('battery') || lowerMessage.includes('lithium')) {
      return 'Batteries contain hazardous materials like lithium, cobalt, and mercury. Never put them in regular trash! Find battery drop-off locations at retailers like Best Buy, Home Depot, or use the Call2Recycle locator. Handle with care and avoid puncturing.';
    } else if (lowerMessage.includes('computer') || lowerMessage.includes('laptop') || lowerMessage.includes('pc')) {
      return 'For computers/laptops: 1) Back up and securely wipe your hard drive 2) Remove batteries 3) Check manufacturer recycling programs 4) Donate if still functional 5) Use certified e-waste recyclers. Contains valuable metals that can be recovered!';
    } else if (lowerMessage.includes('tv') || lowerMessage.includes('monitor') || lowerMessage.includes('screen')) {
      return 'TVs and monitors may contain mercury and lead. Never break the screen! Many retailers offer take-back programs. Check with Best Buy, Staples, or local electronics recyclers. Some contain valuable materials for recovery.';
    } else if (lowerMessage.includes('cable') || lowerMessage.includes('wire') || lowerMessage.includes('charger')) {
      return 'Cables and chargers can be recycled! Many contain copper and other valuable metals. Drop them off at electronics recycling centers or retailers with take-back programs. Bundle them together for easier recycling.';
    } else if (lowerMessage.includes('mercury') || lowerMessage.includes('lead') || lowerMessage.includes('hazard')) {
      return 'Hazardous materials in e-waste include mercury (thermostats, fluorescent bulbs), lead (old TVs, solder), cadmium (batteries), and lithium (batteries). These require special handling at hazardous waste facilities. Never dispose in regular trash!';
    } else if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('find')) {
      return 'Find e-waste recycling locations: 1) Use Earth911.com recycling locator 2) Check Call2Recycle.org for battery drop-offs 3) Visit retailer websites (Best Buy, Staples, Home Depot) 4) Contact your local waste management authority 5) Check manufacturer take-back programs.';
    } else if (lowerMessage.includes('data') || lowerMessage.includes('privacy') || lowerMessage.includes('security')) {
      return 'Protect your data before disposal: 1) Back up important files 2) Sign out of all accounts 3) Perform factory reset 4) Use data destruction software for hard drives 5) Consider physical destruction for sensitive data 6) Remove SIM cards and memory cards.';
    } else if (lowerMessage.includes('recycle') || lowerMessage.includes('dispose')) {
      return 'Safe e-waste disposal steps: 1) Identify the device type 2) Remove batteries if possible 3) Wipe personal data 4) Find certified recyclers using Earth911.com 5) Check manufacturer programs 6) Never put in regular trash 7) Consider donation if functional.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help with all your e-waste questions. You can ask me about specific devices, disposal locations, hazardous materials, data security, or recycling best practices. What would you like to know?';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I can help you with: 📱 Device-specific disposal advice 🔋 Battery safety and recycling 📍 Finding recycling locations 🛡️ Data security before disposal ⚠️ Hazardous material identification 🌱 Environmental impact information. Just ask me anything!';
    } else {
      return 'I can help with e-waste disposal questions! Try asking about specific devices (phones, computers, batteries), disposal locations, hazardous materials, or data security. What would you like to know about e-waste recycling?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-eco-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral-500 rounded-full animate-pulse"></span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-eco-200/50 dark:border-gray-700/50 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-eco-500 to-teal-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">EcoBot</h3>
                  <p className="text-white/80 text-xs">AI E-waste Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-purple-500' 
                        : 'bg-gradient-to-r from-eco-500 to-teal-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`px-3 py-2 rounded-xl ${
                      message.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-eco-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about e-waste disposal..."
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-3 py-2 bg-gradient-to-r from-eco-500 to-teal-500 text-white rounded-lg hover:from-eco-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;