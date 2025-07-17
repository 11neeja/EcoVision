import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Send, MessageSquare } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface VoiceClassificationProps {
  onVoiceInput: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const VoiceClassification: React.FC<VoiceClassificationProps> = ({
  onVoiceInput,
  isListening,
  setIsListening
}) => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'assistant', message: string}>>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        showInfo('Listening... Please speak clearly');
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setCurrentQuery(finalTranscript);
          processVoiceQuery(finalTranscript);
          setIsListening(false);
        }
      };

      recognitionInstance.onerror = (event) => {
        showError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceInput, showSuccess, showError, showInfo, setIsListening]);

  const processVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    setConversation(prev => [...prev, { type: 'user', message: query }]);

    try {
      // Enhanced AI response using Gemini-like intelligence
      const response = await generateAIResponse(query);
      
      setConversation(prev => [...prev, { type: 'assistant', message: response }]);
      
      // Speak the response
      speakText(response);
      
      showSuccess('Voice query processed successfully!');
    } catch (error) {
      const errorResponse = "I'm sorry, I couldn't process your request. Please try asking about e-waste classification, disposal methods, or recycling tips.";
      setConversation(prev => [...prev, { type: 'assistant', message: errorResponse }]);
      speakText(errorResponse);
      showError('Failed to process voice query');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    
    // Enhanced AI-like responses with more context and detail
    if (lowerQuery.includes('phone') || lowerQuery.includes('smartphone') || lowerQuery.includes('mobile')) {
      return `For smartphone disposal, follow these steps: First, back up your data and perform a factory reset to protect your privacy. Remove the SIM card and any memory cards. Check if your phone manufacturer has a take-back program - companies like Apple, Samsung, and Google offer trade-in or recycling services. If the phone still works, consider donating it to charity. For broken phones, take them to certified e-waste recyclers. Never throw smartphones in regular trash as they contain lithium batteries and rare earth metals that can harm the environment. The battery alone can contaminate soil for up to 100 years if improperly disposed.`;
    }
    
    if (lowerQuery.includes('battery') || lowerQuery.includes('lithium')) {
      return `Batteries require special handling due to hazardous materials like lithium, cobalt, mercury, and lead. Never put batteries in regular trash or recycling bins. For disposal, use battery drop-off locations at retailers like Best Buy, Home Depot, Lowe's, or Staples. You can also use the Call2Recycle website to find nearby collection points. Car batteries should be returned to auto parts stores. Handle damaged or swollen batteries with extreme care - they can leak toxic chemicals or even catch fire. Store old batteries in a cool, dry place until disposal. Remember, a single battery can contaminate 20 square meters of soil and 400 liters of water.`;
    }
    
    if (lowerQuery.includes('computer') || lowerQuery.includes('laptop') || lowerQuery.includes('pc')) {
      return `Computer disposal requires careful data protection and proper recycling. Start by backing up important files, then use data destruction software like DBAN to securely wipe your hard drive - simple deletion isn't enough. For extra security with sensitive data, consider physical destruction of the hard drive. Remove any batteries from laptops. Check manufacturer recycling programs from Dell, HP, Lenovo, or Apple. Many offer free take-back services. If the computer still works, consider donating to schools, libraries, or nonprofits. For broken computers, use certified e-waste recyclers who can recover valuable materials like gold, silver, and rare earth elements. Computers contain both valuable and hazardous materials, making proper recycling crucial.`;
    }
    
    if (lowerQuery.includes('tv') || lowerQuery.includes('monitor') || lowerQuery.includes('screen')) {
      return `TVs and monitors need special handling, especially older CRT models which contain lead in the glass. Never break or damage the screen as this can release toxic materials. Many retailers like Best Buy accept old TVs and monitors for recycling, though fees may apply for larger items. Check with your local waste management authority for e-waste collection events. Flat-screen TVs and monitors contain mercury in the backlighting and various rare earth elements. If the device still works, consider donating to community centers, schools, or charities. Always transport screens carefully to prevent damage and potential exposure to hazardous materials.`;
    }
    
    if (lowerQuery.includes('cable') || lowerQuery.includes('wire') || lowerQuery.includes('charger')) {
      return `Cables and chargers are actually quite valuable for recycling due to their copper content. Bundle them together and take them to electronics recycling centers or retailers with take-back programs. Many scrap metal dealers also accept copper-containing cables. Before disposal, check if the cables still work - functional chargers and cables can be donated or sold. Remove any attached devices first. USB cables, power cords, HDMI cables, and phone chargers all contain recoverable metals. Some municipalities include cables in their e-waste collection programs. Never throw cables in regular trash as the copper and other metals are too valuable to waste in landfills.`;
    }
    
    if (lowerQuery.includes('mercury') || lowerQuery.includes('lead') || lowerQuery.includes('hazard') || lowerQuery.includes('toxic')) {
      return `Hazardous materials in electronics pose serious environmental and health risks. Mercury is found in fluorescent bulbs, some thermostats, and older LCD backlights - it can damage the nervous system and contaminate water. Lead appears in CRT monitor glass, solder, and some batteries - it's toxic to children's developing brains. Cadmium in rechargeable batteries can cause kidney damage. Chromium in some components can cause respiratory issues. These materials require special handling at hazardous waste facilities, never regular trash. When handling potentially hazardous e-waste, wear gloves, work in ventilated areas, and avoid breaking or damaging items. Contact your local environmental agency for hazardous waste collection days and approved disposal sites.`;
    }
    
    if (lowerQuery.includes('where') || lowerQuery.includes('location') || lowerQuery.includes('find') || lowerQuery.includes('near me')) {
      return `To find e-waste recycling locations near you, try these resources: Visit Earth911.com and enter your zip code and item type for nearby recycling centers. Use Call2Recycle.org specifically for battery drop-off locations. Check retailer websites - Best Buy, Staples, Home Depot, and Office Depot have store locator tools for their recycling programs. Contact your city or county waste management department for local e-waste collection events and permanent drop-off sites. Many municipalities hold quarterly or annual e-waste collection drives. Some manufacturers like Apple, Dell, and HP offer mail-in recycling programs. For large items, some recyclers offer pickup services for a fee. Always verify that recyclers are certified and follow responsible recycling practices.`;
    }
    
    if (lowerQuery.includes('data') || lowerQuery.includes('privacy') || lowerQuery.includes('security') || lowerQuery.includes('personal information')) {
      return `Protecting your personal data before disposal is crucial. Start by backing up any files you want to keep to an external drive or cloud storage. Sign out of all accounts including email, social media, and cloud services. Perform a factory reset on phones and tablets. For computers, use data destruction software like DBAN, Eraser, or CCleaner's Drive Wiper to overwrite the hard drive multiple times - simple deletion or formatting isn't secure enough. Remove and physically destroy hard drives if they contained highly sensitive information. Don't forget to remove SIM cards, SD cards, and USB drives. For extra security, some services offer professional data destruction with certificates of destruction. Remember, deleted files can often be recovered without proper data wiping.`;
    }
    
    if (lowerQuery.includes('recycle') || lowerQuery.includes('dispose') || lowerQuery.includes('get rid of')) {
      return `Safe e-waste disposal follows these key steps: First, identify your item type as different electronics have different requirements. Remove batteries when possible and dispose separately. Wipe all personal data using appropriate methods for your device type. Find certified recyclers using Earth911.com or manufacturer take-back programs. Never put e-waste in regular trash or curbside recycling. Consider donation if items still work - many nonprofits, schools, and community centers need electronics. For valuable items like smartphones or laptops, trade-in programs might offer credit. Schedule pickup for large items if available. Keep receipts from certified recyclers for tax deductions if donating. Remember, proper e-waste recycling recovers valuable materials and prevents environmental contamination.`;
    }
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return `Hello! I'm your AI-powered e-waste assistant. I can help you with safe disposal of electronics, finding recycling locations, understanding hazardous materials, protecting your data before disposal, and learning about environmental impacts. You can ask me about specific devices like phones, computers, batteries, or TVs. I can also guide you through proper recycling procedures and help you find certified recyclers in your area. What would you like to know about e-waste management today?`;
    }
    
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do') || lowerQuery.includes('assist')) {
      return `I can assist you with comprehensive e-waste management: Device-specific disposal advice for phones, computers, TVs, batteries, and more. Data security guidance to protect your personal information before disposal. Finding certified recycling locations and collection events near you. Understanding hazardous materials and safety precautions. Environmental impact information and recycling benefits. Manufacturer take-back programs and trade-in options. Legal requirements and regulations for e-waste disposal. Cost information for recycling services. Donation options for working electronics. Emergency procedures for damaged or leaking batteries. Just ask me about any electronic device or e-waste topic!`;
    }
    
    if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('fee') || lowerQuery.includes('money')) {
      return `E-waste recycling costs vary by item and location. Many options are free: manufacturer take-back programs, retailer recycling (Best Buy, Staples), municipal collection events, and some certified recyclers. Fees typically apply to: CRT TVs and monitors ($10-30), large appliances ($20-50), and some pickup services ($25-100). Batteries, phones, and small electronics are usually free to recycle. Some valuable items like working phones or laptops might earn you money through trade-in programs. Check for free community collection events - many cities host these quarterly. Nonprofit organizations often accept working electronics for free. Compare costs and services, but never choose illegal dumping to save money - fines can be $500-5000 plus environmental damage costs.`;
    }
    
    // Default comprehensive response
    return `I can help you with e-waste disposal questions! I specialize in providing detailed guidance on safely disposing of electronics like phones, computers, batteries, TVs, and other devices. I can help you find recycling locations, understand hazardous materials, protect your personal data, and learn about environmental impacts. Try asking me about specific devices, disposal methods, data security, or finding recyclers near you. What specific e-waste question can I help you with today?`;
  };

  const toggleListening = () => {
    if (!recognition) {
      showError('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more natural voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') || 
        voice.lang.includes('en-US')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextQuery = () => {
    if (currentQuery.trim()) {
      processVoiceQuery(currentQuery);
      setCurrentQuery('');
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-eco-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-10 h-10 text-eco-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Voice Assistant</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Ask me anything about e-waste disposal, recycling, or environmental impact
        </p>
      </div>

      {/* Voice Input Section */}
      <div className="flex flex-col items-center space-y-6 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center ${
            isListening
              ? 'bg-red-500 text-white shadow-lg animate-pulse'
              : 'bg-eco-500 text-white hover:bg-eco-600 shadow-lg hover:shadow-xl'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </motion.button>

        {/* Text Input Alternative */}
        <div className="w-full max-w-md">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextQuery()}
              placeholder="Or type your question here..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none text-gray-900 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTextQuery}
              disabled={!currentQuery.trim() || isProcessing}
              className="px-4 py-3 bg-eco-500 text-white rounded-xl hover:bg-eco-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {transcript && (
          <div className="flex items-center space-x-2 max-w-md">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex-1">
              "{transcript}"
            </div>
            <button
              onClick={() => speakText(transcript)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Speak transcript"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conversation.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="mb-4">Ask me about:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-eco-50 dark:bg-eco-900/20 rounded-lg p-2">📱 Phone disposal</div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">🔋 Battery recycling</div>
              <div className="bg-coral-50 dark:bg-coral-900/20 rounded-lg p-2">💻 Computer wiping</div>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-2">📍 Recycling locations</div>
            </div>
          </div>
        )}

        {conversation.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-xl ${
              message.type === 'user'
                ? 'bg-eco-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm leading-relaxed">{message.message}</p>
              {message.type === 'assistant' && (
                <button
                  onClick={() => speakText(message.message)}
                  className="mt-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Speak response"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-eco-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-eco-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-eco-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Processing your query...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Voice input not supported in this browser. You can still use text input above.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceClassification;