import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

const QuizModule: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number; correct: boolean }[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; time: number }[]>([]);
  
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();

  // Expanded question bank with different questions each time
  const questionBank: Question[] = [
    {
      id: '1',
      question: 'What percentage of e-waste is currently recycled globally?',
      options: ['10%', '20%', '30%', '40%'],
      correctAnswer: 1,
      explanation: 'Only about 20% of e-waste is formally recycled globally, highlighting the need for better disposal practices.',
      category: 'Statistics'
    },
    {
      id: '2',
      question: 'Which of these materials is commonly found in smartphone batteries?',
      options: ['Mercury', 'Lithium', 'Lead', 'Asbestos'],
      correctAnswer: 1,
      explanation: 'Lithium is the primary material in most smartphone batteries, making proper disposal crucial for safety.',
      category: 'Materials'
    },
    {
      id: '3',
      question: 'What is the fastest-growing waste stream in the world?',
      options: ['Plastic waste', 'Electronic waste', 'Food waste', 'Paper waste'],
      correctAnswer: 1,
      explanation: 'Electronic waste is the fastest-growing waste stream, increasing by 3-4% annually.',
      category: 'Environment'
    },
    {
      id: '4',
      question: 'Which component in old CRT monitors contains lead?',
      options: ['The plastic casing', 'The screen glass', 'The circuit board', 'The power cord'],
      correctAnswer: 1,
      explanation: 'CRT monitor screens contain lead in the glass to protect against radiation, requiring special disposal.',
      category: 'Hazardous Materials'
    },
    {
      id: '5',
      question: 'What should you do before disposing of a hard drive?',
      options: ['Format it', 'Physically destroy it', 'Remove the cables', 'Clean the exterior'],
      correctAnswer: 1,
      explanation: 'Physical destruction is the most secure way to ensure data cannot be recovered from disposed hard drives.',
      category: 'Data Security'
    },
    {
      id: '6',
      question: 'How much e-waste does the average person generate per year?',
      options: ['5 kg', '10 kg', '20 kg', '50 kg'],
      correctAnswer: 2,
      explanation: 'The average person generates about 20 kg of e-waste annually, equivalent to throwing away a microwave every year.',
      category: 'Statistics'
    },
    {
      id: '7',
      question: 'Which rare earth element is commonly found in smartphone screens?',
      options: ['Gold', 'Silver', 'Indium', 'Platinum'],
      correctAnswer: 2,
      explanation: 'Indium is used in touchscreen displays and is becoming increasingly scarce, making recycling important.',
      category: 'Materials'
    },
    {
      id: '8',
      question: 'What happens to improperly disposed batteries in landfills?',
      options: ['They decompose safely', 'They leak toxic chemicals', 'They turn into compost', 'Nothing happens'],
      correctAnswer: 1,
      explanation: 'Batteries can leak toxic chemicals like mercury, lead, and cadmium into soil and groundwater.',
      category: 'Environment'
    },
    {
      id: '9',
      question: 'Which country produces the most e-waste globally?',
      options: ['China', 'United States', 'India', 'Germany'],
      correctAnswer: 0,
      explanation: 'China produces the most e-waste globally, followed by the United States and India.',
      category: 'Statistics'
    },
    {
      id: '10',
      question: 'What is the recommended way to dispose of fluorescent light bulbs?',
      options: ['Regular trash', 'Hazardous waste facility', 'Recycling bin', 'Bury in garden'],
      correctAnswer: 1,
      explanation: 'Fluorescent bulbs contain mercury and must be taken to hazardous waste facilities for proper disposal.',
      category: 'Hazardous Materials'
    },
    {
      id: '11',
      question: 'How long can a single smartphone battery contaminate soil?',
      options: ['1 year', '10 years', '100 years', '1000 years'],
      correctAnswer: 2,
      explanation: 'A single smartphone battery can contaminate soil for up to 100 years if not properly disposed of.',
      category: 'Environment'
    },
    {
      id: '12',
      question: 'What percentage of materials in a typical smartphone can be recycled?',
      options: ['25%', '50%', '75%', '95%'],
      correctAnswer: 3,
      explanation: 'Up to 95% of materials in smartphones can be recycled, including precious metals and rare earth elements.',
      category: 'Recycling'
    }
  ];

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const stored = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    setLeaderboard(stored);
  };

  const getRandomQuestions = (count: number = 5): Question[] => {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const startQuiz = () => {
    const randomQuestions = getRandomQuestions(5);
    setQuestions(randomQuestions);
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setStartTime(new Date());
  };

  const selectAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer,
      correct: isCorrect
    }]);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!startTime || !user) return;

    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    const score = answers.filter(a => a.correct).length;
    const percentage = Math.round((score / questions.length) * 100);

    // Update leaderboard
    const newEntry = {
      name: user.name,
      score: percentage,
      time: timeSpent
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score || a.time - b.time)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('quizLeaderboard', JSON.stringify(updatedLeaderboard));

    setQuizCompleted(true);
    
    if (percentage >= 80) {
      showSuccess(`Excellent! You scored ${percentage}% and earned the Quiz Master badge!`);
    } else if (percentage >= 60) {
      showSuccess(`Good job! You scored ${percentage}%. Keep learning!`);
    } else {
      showError(`You scored ${percentage}%. Review the materials and try again!`);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setStartTime(null);
    setQuestions([]);
  };

  if (!quizStarted) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">E-Waste Knowledge Quiz</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Test your knowledge about electronic waste, recycling, and environmental impact.
            Each quiz features different questions to keep you learning!
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-eco-50 dark:bg-eco-900/20 rounded-xl">
              <div className="text-2xl font-bold text-eco-600">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Random Questions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">~3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
            </div>
            <div className="text-center p-4 bg-coral-50 dark:bg-coral-900/20 rounded-xl">
              <div className="text-2xl font-bold text-coral-600">80%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">To Pass</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startQuiz}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            Start New Quiz
          </motion.button>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-eco-600">{entry.score}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{entry.time}s</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const score = answers.filter(a => a.correct).length;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border border-gray-200/50 dark:border-gray-700/50">
        <div className="mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            percentage >= 80 ? 'bg-eco-100 text-eco-600' :
            percentage >= 60 ? 'bg-yellow-100 text-yellow-600' :
            'bg-coral-100 text-coral-600'
          }`}>
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
          <div className="text-6xl font-bold text-eco-600 mb-2">{percentage}%</div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You answered {score} out of {questions.length} questions correctly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {answers.map((answer, index) => {
            const question = questions[index];
            return (
              <div key={question.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Question {index + 1}</span>
                  {answer.correct ? (
                    <CheckCircle className="w-5 h-5 text-eco-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-coral-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left">{question.question}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-lg font-semibold hover:from-eco-600 hover:to-eco-700 transition-all duration-200 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Take New Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-200/50 dark:border-gray-700/50">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {currentQuestion.category}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'border-eco-500 bg-eco-50 dark:bg-eco-900/20 text-eco-800 dark:text-eco-200'
                          : 'border-coral-500 bg-coral-50 dark:bg-coral-900/20 text-coral-800 dark:text-coral-200'
                        : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
                      : showExplanation && index === currentQuestion.correctAnswer
                      ? 'border-eco-500 bg-eco-50 dark:bg-eco-900/20 text-eco-800 dark:text-eco-200'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  disabled={showExplanation}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                    {showExplanation && (
                      <div className="ml-auto">
                        {index === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-eco-500" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-5 h-5 text-coral-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation:</h4>
                <p className="text-blue-800 dark:text-blue-200">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Exit Quiz
            </button>
            
            {!showExplanation ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-lg font-semibold hover:from-eco-600 hover:to-eco-700 transition-all duration-200"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizModule;