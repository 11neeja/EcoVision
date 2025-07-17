import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Zap, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { useClassification } from '../contexts/ClassificationContext';
import { useNotifications } from '../contexts/NotificationContext';

interface ClassificationResult {
  itemName: string;
  category: string;
  hazardousMaterials: string[];
  safetyLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
  reusabilityScore: number;
  reusabilityLabel: 'Highly Reusable' | 'Moderate' | 'Non-reusable';
  imageUrl: string;
}

const Classify = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const { addClassification } = useClassification();
  const { showSuccess, showError, showInfo } = useNotifications();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const classifyImage = async () => {
    if (!selectedFile) return;

    setIsClassifying(true);
    showInfo('Analyzing your e-waste item...');
    
    try {
      // Simulate AI classification
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock classification results
      const mockResults: ClassificationResult[] = [
        {
          itemName: 'Smartphone Battery',
          category: 'Mobile Device Battery',
          hazardousMaterials: ['Lithium', 'Cobalt'],
          safetyLevel: 'high',
          recommendations: [
            'Do not puncture or disassemble',
            'Keep away from heat sources',
            'Dispose at certified battery recycling center',
            'Never throw in regular trash'
          ],
          confidence: 94.5,
          reusabilityScore: 25,
          reusabilityLabel: 'Non-reusable',
          imageUrl: preview || ''
        },
        {
          itemName: 'LED Monitor',
          category: 'Display Device',
          hazardousMaterials: ['Mercury (trace amounts)', 'Lead'],
          safetyLevel: 'medium',
          recommendations: [
            'Remove all cables before disposal',
            'Take to electronics recycling facility',
            'Check manufacturer take-back programs',
            'Do not break screen'
          ],
          confidence: 87.2,
          reusabilityScore: 65,
          reusabilityLabel: 'Moderate',
          imageUrl: preview || ''
        },
        {
          itemName: 'USB Cable',
          category: 'Electronic Accessory',
          hazardousMaterials: [],
          safetyLevel: 'low',
          recommendations: [
            'Can be recycled with other electronics',
            'Check if still functional for donation',
            'Remove from other devices before disposal'
          ],
          confidence: 92.8,
          reusabilityScore: 85,
          reusabilityLabel: 'Highly Reusable',
          imageUrl: preview || ''
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);

      // Store the classification in the dashboard
      addClassification({
        itemName: randomResult.itemName,
        category: randomResult.category,
        hazardousMaterials: randomResult.hazardousMaterials,
        safetyLevel: randomResult.safetyLevel,
        recommendations: randomResult.recommendations,
        confidence: randomResult.confidence,
        reusabilityScore: randomResult.reusabilityScore,
        reusabilityLabel: randomResult.reusabilityLabel,
        imageUrl: randomResult.imageUrl
      });

      showSuccess(`Successfully classified ${randomResult.itemName}! Data saved to your dashboard.`);
    } catch (error) {
      showError('Classification failed. Please try again.');
    } finally {
      setIsClassifying(false);
    }
  };

  const downloadReport = () => {
    if (result) {
      showSuccess('Report downloaded successfully!');
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'low': return 'eco';
      case 'medium': return 'coral';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI E-Waste <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">Classification</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload an image of your electronic waste for instant AI-powered identification and safety analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-25 dark:hover:bg-purple-900/10'
              }`}
            >
              <input {...getInputProps()} />
              
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-eco-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={classifyImage}
                disabled={!selectedFile || isClassifying}
                className="flex-1 bg-gradient-to-r from-eco-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-eco-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isClassifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Classify Image
                  </>
                )}
              </button>
              
              <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {result ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Classification Results
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 bg-eco-100 dark:bg-eco-900/20 text-eco-800 dark:text-eco-200 rounded-full text-sm font-medium">
                    {result.confidence}% Confidence
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Item Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{result.itemName}</p>
                      <p className="text-gray-600 dark:text-gray-400">{result.category}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Safety Assessment</h3>
                    <div className={`bg-${getSafetyColor(result.safetyLevel)}-50 dark:bg-${getSafetyColor(result.safetyLevel)}-900/20 border border-${getSafetyColor(result.safetyLevel)}-200 dark:border-${getSafetyColor(result.safetyLevel)}-800 rounded-lg p-4`}>
                      <div className="flex items-center mb-2">
                        <div className={`text-${getSafetyColor(result.safetyLevel)}-600 mr-2`}>
                          {getSafetyIcon(result.safetyLevel)}
                        </div>
                        <span className={`font-medium text-${getSafetyColor(result.safetyLevel)}-800 dark:text-${getSafetyColor(result.safetyLevel)}-200 capitalize`}>
                          {result.safetyLevel} Risk Level
                        </span>
                      </div>
                      {result.hazardousMaterials.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hazardous Materials:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.hazardousMaterials.map((material, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reusability Score</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {result.reusabilityLabel}
                        </span>
                        <span className="text-lg font-bold text-eco-600 dark:text-eco-400">
                          {result.reusabilityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-eco-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${result.reusabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-eco-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={downloadReport}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Report
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload an image and click "Classify Image" to get started with AI-powered e-waste identification.
                  Your results will be automatically saved to your dashboard.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Classify;